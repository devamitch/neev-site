import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Lock, FileText, Image as ImageIcon,
  Video, Plus, Search,
  Heart, Star, ShieldCheck, Sparkles, X, Upload, Loader2, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection, addDoc, onSnapshot, deleteDoc, doc,
  serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

type VaultEntry = {
  id: string;
  title: string;
  type: string;
  date: string;
  iconName: 'FileText' | 'Video' | 'Shield' | 'Image' | 'ShieldCheck' | 'Star';
  color: string;
  category: 'documents' | 'memories' | 'legal' | 'financial';
  fileUrl?: string;
  storagePath?: string;
  createdAt?: any;
};

const ICON_MAP = { FileText, Video, Shield, Image: ImageIcon, ShieldCheck, Star };

const categories = [
  { id: 'all', label: 'All Files' },
  { id: 'documents', label: 'Documents' },
  { id: 'memories', label: 'Memories' },
  { id: 'legal', label: 'Legal & Wills' },
  { id: 'financial', label: 'Financial' },
] as const;

type CategoryId = typeof categories[number]['id'];

const ICON_FOR_TYPE: Record<string, VaultEntry['iconName']> = {
  'PDF Document': 'FileText',
  'Photo Album': 'Image',
  'Video Memory': 'Video',
  'Scanned Document': 'Shield',
  'Career Document': 'ShieldCheck',
  'Educational': 'Star',
};

const COLOR_FOR_CAT: Record<string, string> = {
  documents: 'bg-secondary-container/40',
  memories: 'bg-tertiary-container/40',
  legal: 'bg-primary-container/40',
  financial: 'bg-surface-container-high/40',
};

const featuredMemories = [
  {
    image: '/images/neev_real_home.png',
    title: 'The Sanctuary of Home',
    quote: '"A home is not just a structure — it is the living memory of every laugh, every meal, every bedtime story. Preserve it for those who come after."',
  },
  {
    image: '/images/neev_college_students.png',
    title: 'The Journey of Learning',
    quote: '"Education is not just about grades — it is about curiosity, character, and the courage to keep asking questions."',
  },
  {
    image: '/images/neev_real_connection.png',
    title: 'Real Connections',
    quote: '"In a world of screens, genuine family bonds are the most precious legacy you can leave. Time spent together becomes the story your children tell their children."',
  },
];

export default function LegacyVaultPage() {
  const { user, familyId } = useAuth();
  const activeFamilyId = familyId || user?.uid || 'default';

  const [items, setItems] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('PDF Document');
  const [newCategory, setNewCategory] = useState<VaultEntry['category']>('documents');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  // Firestore real-time listener
  useEffect(() => {
    const col = collection(db, 'families', activeFamilyId, 'vault');
    const q = query(col, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as VaultEntry)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [activeFamilyId]);

  // GSAP animation — once after load
  useEffect(() => {
    if (loading || animatedRef.current) return;
    animatedRef.current = true;
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from(headerRef.current?.children || [], { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out' })
        .from(statsRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.1, duration: 1, ease: 'power2.out' }, '-=0.6')
        .from('.vault-item', { scale: 0.9, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4');
    });
    return () => ctx.revert();
  }, [loading]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const storage = getStorage();
      const path = `families/${activeFamilyId}/vault/${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(sRef, file);

      const url = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => { resolve(await getDownloadURL(uploadTask.snapshot.ref)); }
        );
      });

      await addDoc(collection(db, 'families', activeFamilyId, 'vault'), {
        title: newTitle.trim() || file.name,
        type: newType,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        iconName: ICON_FOR_TYPE[newType] || 'FileText',
        color: COLOR_FOR_CAT[newCategory] || 'bg-primary-container/40',
        category: newCategory,
        fileUrl: url,
        storagePath: path,
        createdAt: serverTimestamp(),
      });

      setNewTitle(''); setNewType('PDF Document'); setNewCategory('documents');
      setShowUpload(false);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
    e.target.value = '';
  };

  const handleAddEntry = async () => {
    if (!newTitle.trim()) {
      fileInputRef.current?.click();
      return;
    }
    await addDoc(collection(db, 'families', activeFamilyId, 'vault'), {
      title: newTitle.trim(),
      type: newType,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      iconName: ICON_FOR_TYPE[newType] || 'FileText',
      color: COLOR_FOR_CAT[newCategory] || 'bg-primary-container/40',
      category: newCategory,
      createdAt: serverTimestamp(),
    });
    setNewTitle(''); setNewType('PDF Document'); setNewCategory('documents');
    setShowUpload(false);
  };

  const handleDelete = async (item: VaultEntry) => {
    if (item.storagePath) {
      try {
        const storage = getStorage();
        await deleteObject(storageRef(storage, item.storagePath));
      } catch {}
    }
    await deleteDoc(doc(db, 'families', activeFamilyId, 'vault', item.id));
  };

  const featured = featuredMemories[featuredIndex];
  const memoryCount = items.filter(i => i.category === 'memories').length;
  const docCount = items.filter(i => i.category !== 'memories').length;

  return (
    <div className="max-w-[1160px] mx-auto p-6 md:p-10 space-y-12 selection:bg-primary-container selection:text-on-surface relative overflow-hidden">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      {/* Decorative glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[160px] -z-10" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[160px] -z-10" />

      {/* Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-primary" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-bold">THE SANCTUARY</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-on-surface tracking-tight">
            Legacy <span className="italic text-primary/70">Vault</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl font-light leading-relaxed font-sans">
            Securely preserve your family's most precious documents, memories, and wisdom for generations to come.
          </p>
        </div>
        <Button onClick={() => setShowUpload(v => !v)}
          className="h-14 px-8 bg-primary text-on-primary hover:bg-primary/90 rounded-md flex items-center gap-3 uppercase tracking-[0.2em] text-xs font-sans font-bold transition-all active:scale-95 shrink-0">
          <Plus className="w-4 h-4" /> Secure New Asset
        </Button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <Card className="border border-outline-variant/30 rounded-2xl p-6 bg-surface-container-low">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-on-surface">Add to Vault</h2>
            <button onClick={() => setShowUpload(false)} className="text-on-surface-variant hover:text-on-surface">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Asset Name</label>
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Birth Certificate"
                className="bg-surface border-outline-variant/30" />
            </div>
            <div>
              <label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Type</label>
              <select value={newType} onChange={e => setNewType(e.target.value)}
                className="w-full px-3 py-2.5 bg-surface text-on-surface rounded-md border border-outline-variant/30 font-sans text-sm">
                <option>PDF Document</option>
                <option>Photo Album</option>
                <option>Video Memory</option>
                <option>Scanned Document</option>
                <option>Career Document</option>
                <option>Educational</option>
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] font-sans font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Category</label>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value as VaultEntry['category'])}
                className="w-full px-3 py-2.5 bg-surface text-on-surface rounded-md border border-outline-variant/30 font-sans text-sm">
                <option value="documents">Documents</option>
                <option value="memories">Memories</option>
                <option value="legal">Legal & Wills</option>
                <option value="financial">Financial</option>
              </select>
            </div>
          </div>
          {uploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-on-surface-variant">Uploading…</span>
                <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={handleAddEntry} disabled={uploading} className="bg-primary text-on-primary hover:bg-primary/90 flex items-center gap-2">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {newTitle.trim() ? 'Add Entry' : 'Choose File'}
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 border-outline-variant/50">
              <Upload className="w-4 h-4" /> Upload File
            </Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Security Level', value: 'End-to-End Encrypted', icon: Shield, color: 'bg-primary-container text-primary' },
          { label: 'Total Assets', value: `${items.length} files secured`, icon: Lock, color: 'bg-tertiary-container text-on-tertiary-container' },
          { label: 'Memories Preserved', value: `${memoryCount} memory${memoryCount !== 1 ? 'ies' : 'y'}`, icon: Heart, color: 'bg-secondary-container text-on-secondary-container' },
        ].map((stat, i) => (
          <Card key={i} className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-center gap-6 group">
            <div className={`w-14 h-14 ${stat.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-sans text-on-surface-variant uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="font-serif text-xl text-on-surface">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
            <Input placeholder="Search your legacy…"
              className="bg-surface-container-low/50 border-none h-12 pl-12 rounded-xl font-sans text-on-surface placeholder:text-on-surface-variant/40"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <Button key={cat.id} onClick={() => setSelectedCategory(cat.id)} variant="ghost"
                className={`whitespace-nowrap rounded-full px-6 h-10 font-sans font-medium text-sm transition-all ${
                  selectedCategory === cat.id ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface-variant'
                }`}>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <Shield className="w-10 h-10 mb-3 opacity-30" />
                <p className="font-serif text-lg">No items found.</p>
                <button onClick={() => setShowUpload(true)} className="mt-3 text-sm text-primary hover:underline">Add your first asset</button>
              </div>
            ) : filteredItems.map(item => {
              const Icon = ICON_MAP[item.iconName] || FileText;
              return (
                <Card key={item.id} className="vault-item bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:bg-surface-container-low/50 transition-all duration-500 cursor-pointer group shadow-lg shadow-black/5 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-6 h-6 text-on-surface" />
                    </div>
                    <div className="flex gap-1">
                      {item.fileUrl && (
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                          onClick={e => e.stopPropagation()}>
                          <Upload className="w-3.5 h-3.5 rotate-180" />
                        </a>
                      )}
                      <button onClick={e => { e.stopPropagation(); handleDelete(item); }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-base text-on-surface truncate group-hover:text-primary transition-colors">{item.title}</h4>
                    <div className="flex items-center gap-2 text-[0.65rem] text-on-surface-variant font-sans font-medium uppercase tracking-wider">
                      <span>{item.type}</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row group shadow-xl shadow-black/5">
          <div className="w-full md:w-1/2 overflow-hidden relative h-48 md:h-auto">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-10 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[1px] bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-bold">FAMILY WISDOM</span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-on-surface leading-tight">{featured.title}</h3>
              <p className="text-on-surface-variant font-serif italic leading-relaxed opacity-80 text-sm">{featured.quote}</p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-1.5">
                {featuredMemories.map((_, i) => (
                  <button key={i} onClick={() => setFeaturedIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === featuredIndex ? 'w-8 bg-primary' : 'w-3 bg-primary/20'}`} />
                ))}
              </div>
              <Button onClick={() => setFeaturedIndex(prev => (prev + 1) % featuredMemories.length)}
                className="bg-primary text-on-primary hover:bg-primary/90 rounded-md px-8 h-11">
                Next Memory
              </Button>
            </div>
          </div>
        </Card>

        {/* Guardian Insight */}
        <Card className="bg-surface-container-low/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between relative group">
          <div className="h-36 overflow-hidden relative">
            <img src="/images/neev_guardian_laptop.png" alt="Guardian AI"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-surface-container-low/80" />
          </div>
          <div className="p-8 flex flex-col flex-1 space-y-6">
            <div className="absolute top-4 right-4 w-32 h-32 bg-primary-container/20 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-surface/40 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-on-surface">Guardian Insight</h3>
                <p className="text-on-surface-variant font-light leading-relaxed font-sans text-sm">
                  Your vault is a living record of your family's journey. Documents added here are persisted securely — accessible only to your family.
                </p>
              </div>
            </div>
            <Button onClick={() => setShowUpload(true)}
              className="w-full h-12 bg-primary text-on-primary hover:bg-primary/90 rounded-md font-sans font-medium relative z-10">
              Add to Vault
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
