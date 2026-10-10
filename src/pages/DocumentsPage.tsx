import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus, 
  X, 
  ArrowUpDown, 
  FolderLock, 
  FileText,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext.tsx';
import { DocumentCard } from '../components/DocumentCard.tsx';
import { DocumentTable } from '../components/DocumentTable.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import type { DocumentItem, DocumentCategory } from '../types/index.ts';

interface DocumentsPageProps {
  onNavigate: (path: string) => void;
  onViewDoc: (doc: DocumentItem) => void;
  onEditDoc: (doc: DocumentItem) => void;
  onDeleteDoc: (doc: DocumentItem) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  onNavigate,
  onViewDoc,
  onEditDoc,
  onDeleteDoc,
  initialQuery = '',
  initialCategory = '',
}) => {
  const { documents, downloadDocument } = useDocuments();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');

  // Extract unique academic years and semesters for filter dropdowns
  const availableYears = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      if (d.academicYear) set.add(d.academicYear);
    });
    return Array.from(set);
  }, [documents]);

  const availableSemesters = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      if (d.semester) set.add(d.semester);
    });
    return Array.from(set);
  }, [documents]);

  // Filtering & Search
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 1. Search Query (Document name, file name, category, description, file type)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = doc.documentName.toLowerCase().includes(q);
        const matchFile = doc.fileName.toLowerCase().includes(q);
        const matchCat = doc.category.toLowerCase().includes(q);
        const matchDesc = (doc.description || '').toLowerCase().includes(q);
        const matchType = doc.fileType.toLowerCase().includes(q);
        if (!matchName && !matchFile && !matchCat && !matchDesc && !matchType) {
          return false;
        }
      }

      // 2. Category filter
      if (categoryFilter && categoryFilter !== 'all') {
        if (doc.category !== categoryFilter) return false;
      }

      // 3. File type filter
      if (fileTypeFilter !== 'all') {
        if (fileTypeFilter === 'pdf' && doc.fileType !== 'pdf') return false;
        if (fileTypeFilter === 'word' && !['doc', 'docx'].includes(doc.fileType)) return false;
        if (fileTypeFilter === 'sheet' && !['xls', 'xlsx', 'csv'].includes(doc.fileType)) return false;
        if (fileTypeFilter === 'image' && !['jpg', 'jpeg', 'png', 'svg'].includes(doc.fileType)) return false;
      }

      // 4. Academic year filter
      if (academicYearFilter !== 'all') {
        if (doc.academicYear !== academicYearFilter) return false;
      }

      // 5. Semester filter
      if (semesterFilter !== 'all') {
        if (doc.semester !== semesterFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }
      if (sortBy === 'name') {
        return a.documentName.localeCompare(b.documentName);
      }
      if (sortBy === 'size') {
        return b.fileSize - a.fileSize;
      }
      return 0;
    });
  }, [
    documents,
    searchQuery,
    categoryFilter,
    fileTypeFilter,
    academicYearFilter,
    semesterFilter,
    sortBy,
  ]);

  const hasActiveFilters =
    !!searchQuery ||
    (categoryFilter && categoryFilter !== 'all') ||
    fileTypeFilter !== 'all' ||
    academicYearFilter !== 'all' ||
    semesterFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setFileTypeFilter('all');
    setAcademicYearFilter('all');
    setSemesterFilter('all');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, inspect, and download your verified academic records.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/documents/upload')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by document name, file name, category, or notes..."
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="size">File Size (Largest)</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            <Filter className="w-3 h-3" />
            <span>Filters:</span>
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:border-indigo-400"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Certificate">Certificate</option>
            <option value="Identity">Identity</option>
            <option value="Fee">Fee Documents</option>
            <option value="Internship">Internship</option>
            <option value="Project">Project</option>
            <option value="Resume">Resume</option>
            <option value="Other">Other</option>
          </select>

          {/* Format */}
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:border-indigo-400"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF Documents</option>
            <option value="word">Word Docs (.docx)</option>
            <option value="sheet">Excel Spreadsheets (.xlsx)</option>
            <option value="image">Images (PNG/JPG)</option>
          </select>

          {/* Academic Year */}
          {availableYears.length > 0 && (
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:border-indigo-400"
            >
              <option value="all">All Academic Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          )}

          {/* Semester */}
          {availableSemesters.length > 0 && (
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:border-indigo-400"
            >
              <option value="all">All Semesters</option>
              {availableSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-2.5 py-1 rounded-lg text-rose-600 bg-rose-50 border border-rose-200/80 font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}

          <span className="ml-auto text-[11px] font-mono text-slate-400">
            Showing {filteredDocuments.length} of {documents.length}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredDocuments.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="No documents found"
            description={`No stored documents matched your search "${searchQuery}" or active filters. Try adjusting your search query.`}
            actionText="Clear All Filters"
            onAction={clearAllFilters}
            type="search"
          />
        ) : (
          <EmptyState
            title="No documents yet"
            description="Upload your first academic document to start building your secure cloud library."
            actionText="Upload Document"
            onAction={() => onNavigate('/documents/upload')}
            type="documents"
          />
        )
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.documentId}
              document={doc}
              onView={onViewDoc}
              onDownload={downloadDocument}
              onEdit={onEditDoc}
              onDelete={onDeleteDoc}
            />
          ))}
        </div>
      ) : (
        <DocumentTable
          documents={filteredDocuments}
          onView={onViewDoc}
          onDownload={downloadDocument}
          onEdit={onEditDoc}
          onDelete={onDeleteDoc}
        />
      )}
    </div>
  );
};
