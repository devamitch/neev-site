import React, { useState, useEffect, useRef } from 'react';
import { Shield, FileText, Folder, Search, Upload, MoreVertical, Lock, X, Download, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

type VaultDoc = {
  id: string;
  name: string;
  type: string;
  size: string;
  folder: string;
  date: string;
};

const SEED_DOCS: Omit<VaultDoc, 'id'>[] = [
  { name: "Ananya's Passport", type: 'pdf', size: '2.4 MB', date: 'Oct 12, 2025', folder: 'Identity' },
  { name: 'Rohan Vaccination Record', type: 'image', size: '1.1 MB', date: 'Sep 05, 2025', folder: 'Medical' },
  { name: 'School Fee Receipt Q1', type: 'pdf', size: '800 KB', date: 'Aug 20, 2025', folder: 'Education' },
  { name: 'House Lease Agreement', type: 'doc', size: '3.2 MB', date: 'Jan 15, 2025', folder: 'Home' },
  { name: 'Family Insurance Policy', type: 'pdf', size: '5.5 MB', date: 'Nov 01, 2024', folder: 'Insurance' },
];

const FOLDER_DEFS = [
  { name: 'Identity', icon: Shield },
  { name: 'Medical', icon: FileText },
  { name: 'Education', icon: Folder },
  { name: 'Home', icon: Folder },
];

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default function VaultModule() {
  const { user, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';

  const [documents, setDocuments] = useState<VaultDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const foldersRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);
  const seededRef = useRef(false);

  // Real-time Firestore listener + seed on empty
  useEffect(() => {
    const col = collection(db, 'families', activeFamilyId, 'vault');
    const q = query(col, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty && !seededRef.current && !snapshot.metadata.hasPendingWrites) {
          seededRef.current = true;
          try {
            for (const d of SEED_DOCS) {
              await addDoc(col, { ...d, createdAt: serverTimestamp() });
            }
          } catch (err) {
            console.error('Error seeding vault:', err);
          }
          return;
        }

        const docs: VaultDoc[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name ?? '',
            type: data.type ?? 'file',
            size: data.size ?? '',
            folder: data.folder ?? 'Identity',
            date: data.date ?? '',
          };
        });
        setDocuments(docs);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading vault:', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [activeFamilyId]);

  // GSAP animation once after first load
  useEffect(() => {
    if (loading || animatedRef.current) return;
    animatedRef.current = true;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(headerRef.current?.children || [], {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          foldersRef.current?.children || [],
          { scale: 0.9, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'back.out(1.7)' },
          '-=0.4',
        )
        .from(cardRef.current, { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.6');
    });
    return () => ctx.revert();
  }, [loading]);

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.folder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? d.folder === selectedFolder : true;
    return matchesSearch && matchesFolder;
  });

  // Folder counts derived from live Firestore data
  const folderCounts: Record<string, number> = {};
  documents.forEach((d) => {
    folderCounts[d.folder] = (folderCounts[d.folder] ?? 0) + 1;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop() ?? 'file';
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    try {
      await addDoc(collection(db, 'families', activeFamilyId, 'vault'), {
        name: file.name,
        type: ext,
        size: formatSize(file.size),
        folder: selectedFolder || 'Identity',
        date: today,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error uploading document:', err);
    }
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'families', activeFamilyId, 'vault', id));
    } catch (err) {
      console.error('Error deleting document:', err);
    }
    setOpenMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-[1160px] mx-auto" onClick={() => setOpenMenu(null)}>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />

      <div ref={headerRef} className="rounded-2xl overflow-hidden mb-10 relative">
        <div className="h-48 overflow-hidden">
          <img src="/images/neev_vault.png" alt="Legacy Vault" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-on-surface/70 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl text-white mb-2">Document Vault</h1>
            <p className="text-sm text-white/70 flex items-center gap-2 font-sans font-light">
              <Lock className="w-3 h-3" /> Secure Google Drive-backed storage.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-surface-hi border-surface-mid focus:border-sage"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap bg-primary text-on-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      <div ref={foldersRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {FOLDER_DEFS.map((folder) => (
          <Card
            key={folder.name}
            onClick={() => setSelectedFolder(selectedFolder === folder.name ? null : folder.name)}
            className={`p-6 border-none rounded-md cursor-pointer group transition-colors ${
              selectedFolder === folder.name ? 'bg-primary-container ring-1 ring-primary' : 'bg-surface-hi hover:bg-surface-lo'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                selectedFolder === folder.name ? 'bg-primary/20' : 'bg-sage-mist'
              }`}
            >
              <folder.icon
                className={`w-6 h-6 ${selectedFolder === folder.name ? 'text-primary' : 'text-sage-dim'}`}
              />
            </div>
            <h3 className="font-serif text-lg text-text-ink mb-1">{folder.name}</h3>
            <p className="text-[0.68rem] text-text-muted font-sans font-medium uppercase tracking-wider">
              {folderCounts[folder.name] ?? 0} files
            </p>
          </Card>
        ))}
      </div>

      <div ref={cardRef}>
        <Card className="bg-surface-hi border-none rounded-md overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-surface-lo flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl text-text-ink">
              {selectedFolder ? `${selectedFolder} Documents` : 'Recent Documents'}
            </CardTitle>
            {selectedFolder && (
              <button
                onClick={() => setSelectedFolder(null)}
                className="text-text-muted hover:text-text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </CardHeader>
          <div className="divide-y divide-surface-lo">
            {filteredDocs.length === 0 ? (
              <p className="p-8 text-center text-sm text-text-muted font-sans font-light">No documents found.</p>
            ) : (
              filteredDocs.map((vDoc) => (
                <div
                  key={vDoc.id}
                  className="p-4 md:p-6 flex items-center justify-between hover:bg-surface-lo transition-colors group cursor-pointer relative"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-surface-mid flex items-center justify-center">
                      <FileText className="w-5 h-5 text-text-muted" />
                    </div>
                    <div>
                      <h3 className="text-[1.05rem] font-medium text-text-ink group-hover:text-sage-dim transition-colors font-sans">
                        {vDoc.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-[0.68rem] text-text-muted font-sans font-medium uppercase tracking-wider">
                        <span>{vDoc.folder}</span>
                        <span className="text-text-ghost">•</span>
                        <span>{vDoc.date}</span>
                        <span className="text-text-ghost">•</span>
                        <span>{vDoc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-text-ghost hover:text-text-ink opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === vDoc.id ? null : vDoc.id);
                      }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                    {openMenu === vDoc.id && (
                      <div className="absolute right-0 top-full mt-1 bg-surface-hi border border-surface-mid rounded-md shadow-lg z-10 overflow-hidden min-w-[140px]">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-ink hover:bg-surface-lo transition-colors font-sans">
                          <Download className="w-4 h-4" /> Download
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(vDoc.id);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-sans"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
