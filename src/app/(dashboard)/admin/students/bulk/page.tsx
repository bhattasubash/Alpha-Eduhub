"use client";

import { useState } from "react";
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Users,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Search,
  Filter,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-toastify";

type Step = 'upload' | 'validate' | 'preview' | 'complete';

interface ValidationResult {
  row: number;
  status: 'valid' | 'error' | 'warning';
  data: any;
  errors: string[];
  warnings: string[];
}

interface ImportResult {
  studentsCreated: number;
  parentsCreated: number;
  existingParentsReused: number;
  warnings: number;
  errors: number;
  studentCredentials: any[];
  parentCredentials: any[];
}

export default function BulkStudentImportPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'warning' | 'error'>('all');
  const [commonPassword, setCommonPassword] = useState('Student@123');

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload an Excel (.xlsx) or CSV file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'validate');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/admin/students/bulk', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        setValidationResults(data.validationResults);
        
        // Auto-select valid rows
        const validIndices = data.validationResults
          .map((result: ValidationResult, index: number) => 
            (result.status === 'valid' || result.status === 'warning') ? index : -1
          )
          .filter((index: number) => index !== -1);
        
        setSelectedRows(validIndices);
        setCurrentStep('validate');
        toast.success(`Validated ${data.validRows} of ${data.totalRows} rows`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Validation failed');
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImport = async () => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one row to import');
      return;
    }

    setImporting(true);

    const formData = new FormData();
    formData.append('file', file!);
    formData.append('action', 'import');
    formData.append('selectedRows', JSON.stringify(selectedRows));
    if (commonPassword.trim()) {
      formData.append('commonPassword', commonPassword.trim());
    }

    try {
      const response = await fetch('/api/admin/students/bulk', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setImportResult(data);
        setCurrentStep('complete');
        toast.success(`Successfully imported ${data.studentsCreated} students`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Import failed');
      }
    } catch (error) {
      toast.error('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/admin/students/bulk/template');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_import_template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Template downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const downloadCredentials = async (type: 'student' | 'parent') => {
    if (!importResult) return;

    try {
      const credentials = type === 'student' 
        ? importResult.studentCredentials 
        : importResult.parentCredentials;

      const response = await fetch('/api/admin/students/bulk/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, credentials })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_credentials.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`${type} credentials downloaded successfully`);
      }
    } catch (error) {
      toast.error(`Failed to download ${type} credentials`);
    }
  };

  const filteredResults = validationResults.filter(result => {
    const matchesSearch = 
      result.data.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.data.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.data.class?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      statusFilter === 'all' || 
      result.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Student Import</h2>
        <p className="text-gray-600">Import hundreds of students at once using Excel file</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}>
          <CardContent className="p-8 text-center">
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Upload Excel File</h3>
            <p className="text-sm text-gray-600 mb-4">Drag & drop or click to browse</p>
            <p className="text-xs text-gray-500">Supported: .xlsx, .xls, .csv (Max 5MB)</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer"
              onClick={downloadTemplate}>
          <CardContent className="p-8 text-center">
            <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Download Template</h3>
            <p className="text-sm text-gray-600 mb-4">Get the Excel template with required columns</p>
            <p className="text-xs text-gray-500">Includes example data and formatting</p>
          </CardContent>
        </Card>
      </div>

      {file && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button 
              onClick={() => setFile(null)}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {file && (
        <Card className="bg-white border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-5 flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Common Password for All (Optional)</label>
            <input
              type="text"
              placeholder="Leave blank to auto-generate passwords, or enter a common password for all students/parents."
              value={commonPassword}
              onChange={(e) => setCommonPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-400 w-full"
            />
          </CardContent>
        </Card>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-gray-600 text-center">Uploading and validating... {uploadProgress}%</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {uploading ? 'Validating...' : 'Continue to Validation'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderValidationStep = () => {
    const validCount = validationResults.filter(r => r.status === 'valid' || r.status === 'warning').length;
    const errorCount = validationResults.filter(r => r.status === 'error').length;
    const warningCount = validationResults.filter(r => r.status === 'warning').length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Validation Results</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {validCount} Valid
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {warningCount} Warnings
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {errorCount} Errors
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>File Overview</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="valid">Valid</option>
                  <option value="warning">Warnings</option>
                  <option value="error">Errors</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredResults.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(filteredResults.map((_, i) => validationResults.indexOf(_)));
                          } else {
                            setSelectedRows([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-3 font-medium text-gray-900">Row</th>
                    <th className="text-left p-3 font-medium text-gray-900">Student</th>
                    <th className="text-left p-3 font-medium text-gray-900">Class</th>
                    <th className="text-left p-3 font-medium text-gray-900">Parent</th>
                    <th className="text-left p-3 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(validationResults.indexOf(result))}
                          onChange={(e) => {
                            const originalIndex = validationResults.indexOf(result);
                            if (e.target.checked) {
                              setSelectedRows([...selectedRows, originalIndex]);
                            } else {
                              setSelectedRows(selectedRows.filter(i => i !== originalIndex));
                            }
                          }}
                          disabled={result.status === 'error'}
                        />
                      </td>
                      <td className="p-3 text-sm text-gray-600">{result.row}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{result.data.studentName}</p>
                          <p className="text-xs text-gray-500">{result.data.dateOfBirth}</p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{result.data.class} - {result.data.section}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{result.data.parentName}</p>
                          <p className="text-xs text-gray-500">{result.data.parentMobile}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        {result.status === 'valid' && (
                          <Badge className="bg-green-100 text-green-700">Valid</Badge>
                        )}
                        {result.status === 'warning' && (
                          <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
                        )}
                        {result.status === 'error' && (
                          <Badge className="bg-red-100 text-red-700">Error</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => {
              setCurrentStep('upload');
              setValidationResults([]);
              setSelectedRows([]);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={() => setCurrentStep('preview')}
            disabled={selectedRows.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Preview {selectedRows.length} Students
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderPreviewStep = () => {
    const selectedData = selectedRows.map(index => validationResults[index]);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Preview Import</h2>
          <Badge className="bg-blue-100 text-blue-700">
            {selectedRows.length} Students Ready
          </Badge>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Review Before Import</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    This will create {selectedRows.length} student accounts, generate login credentials, 
                    and link parent accounts. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-900">#</th>
                    <th className="text-left p-3 font-medium text-gray-900">Student Name</th>
                    <th className="text-left p-3 font-medium text-gray-900">Class</th>
                    <th className="text-left p-3 font-medium text-gray-900">Section</th>
                    <th className="text-left p-3 font-medium text-gray-900">Parent Name</th>
                    <th className="text-left p-3 font-medium text-gray-900">Parent Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.map((result, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="p-3 font-medium text-gray-900">{result.data.studentName}</td>
                      <td className="p-3 text-sm text-gray-600">{result.data.class}</td>
                      <td className="p-3 text-sm text-gray-600">{result.data.section}</td>
                      <td className="p-3 text-sm text-gray-600">{result.data.parentName}</td>
                      <td className="p-3 text-sm text-gray-600">{result.data.parentMobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep('validate')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Validation
          </Button>
          <Button 
            onClick={handleImport}
            disabled={importing}
            className="bg-green-600 hover:bg-green-700"
          >
            {importing ? 'Importing...' : 'Confirm Import'}
            <GraduationCap className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Import Completed!</h2>
        <p className="text-gray-600">Successfully created student and parent accounts</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-700">{importResult?.studentsCreated}</p>
            <p className="text-sm text-green-600">Students Created</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-700">{importResult?.parentsCreated}</p>
            <p className="text-sm text-blue-600">Parents Created</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-700">{importResult?.existingParentsReused}</p>
            <p className="text-sm text-purple-600">Parents Reused</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-yellow-700">{importResult?.warnings}</p>
            <p className="text-sm text-yellow-600">Warnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Download Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Security Warning</h4>
                <p className="text-sm text-red-700 mt-1">
                  These files contain sensitive login information. Download and store them securely. 
                  Delete the files after distributing credentials to students and parents.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => downloadCredentials('student')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Student Credentials
            </Button>
            <Button 
              onClick={() => downloadCredentials('parent')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Parent Credentials
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={() => {
            setCurrentStep('upload');
            setFile(null);
            setValidationResults([]);
            setSelectedRows([]);
            setImportResult(null);
          }}
          variant="outline"
        >
          Import More Students
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Student Admission</h1>
        <p className="text-gray-600">Import multiple students at once with automatic account creation</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep === 'upload' ? 'bg-blue-600 text-white' : 
            ['validate', 'preview', 'complete'].includes(currentStep) ? 'bg-green-600 text-white' : 
            'bg-gray-200 text-gray-600'
          }`}>
            {['validate', 'preview', 'complete'].includes(currentStep) ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span>1</span>
            )}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep === 'upload' ? 'text-blue-600' : 
            ['validate', 'preview', 'complete'].includes(currentStep) ? 'text-green-600' : 
            'text-gray-600'
          }`}>Upload</span>
        </div>

        <div className={`w-16 h-1 mx-2 ${
          ['validate', 'preview', 'complete'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-200'
        }`} />

        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep === 'validate' ? 'bg-blue-600 text-white' : 
            ['preview', 'complete'].includes(currentStep) ? 'bg-green-600 text-white' : 
            'bg-gray-200 text-gray-600'
          }`}>
            {['preview', 'complete'].includes(currentStep) ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span>2</span>
            )}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep === 'validate' ? 'text-blue-600' : 
            ['preview', 'complete'].includes(currentStep) ? 'text-green-600' : 
            'text-gray-600'
          }`}>Validate</span>
        </div>

        <div className={`w-16 h-1 mx-2 ${
          ['preview', 'complete'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-200'
        }`} />

        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep === 'preview' ? 'bg-blue-600 text-white' : 
            currentStep === 'complete' ? 'bg-green-600 text-white' : 
            'bg-gray-200 text-gray-600'
          }`}>
            {currentStep === 'complete' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span>3</span>
            )}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep === 'preview' ? 'text-blue-600' : 
            currentStep === 'complete' ? 'text-green-600' : 
            'text-gray-600'
          }`}>Preview</span>
        </div>

        <div className={`w-16 h-1 mx-2 ${
          currentStep === 'complete' ? 'bg-green-600' : 'bg-gray-200'
        }`} />

        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep === 'complete' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <span>4</span>
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep === 'complete' ? 'text-blue-600' : 'text-gray-600'
          }`}>Complete</span>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 'upload' && renderUploadStep()}
          {currentStep === 'validate' && renderValidationStep()}
          {currentStep === 'preview' && renderPreviewStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </CardContent>
      </Card>
    </div>
  );
}