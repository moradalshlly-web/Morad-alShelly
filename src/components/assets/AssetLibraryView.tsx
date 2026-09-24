/**
 * Asset Library View
 * Central repository for all creative project media:
 * Images, Videos, Audio, Voices, Characters, Scripts, Scenes, Documents.
 */

import React, { useEffect, useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Asset, AssetType } from '../../types/database';
import { db } from '../../services/database';
import {
  FolderArchive,
  Search,
  Upload,
  Image as ImageIcon,
  Film,
  Music,
  Mic,
  FileText,
  Users,
  Trash2,
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const AssetLibraryView: React.FC = () => {
  const { activeProjectId, showNotification } = useStudio();
  const { t, isRtl } = useLanguage();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const loadAssets = async () => {
    const list = await db.getAssets();
    setAssets(list);
  };

  useEffect(() => {
    loadAssets();
  }, [activeProjectId]);

  const filteredAssets = assets.filter((asset) => {
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleDeleteAsset = async (assetId: string) => {
    await db.deleteAsset(assetId);
    await loadAssets();
    if (selectedAsset?.id === assetId) setSelectedAsset(null);
    showNotification(isRtl ? 'تم حذف الملف من المكتبة' : 'Asset removed from library', 'info');
  };

  const handleSimulatedUpload = async () => {
    const sampleNames = isRtl
      ? [
          'تأثير توهج العدسة السينمائي 4K',
          'مؤثر صوتي جهير عميق في الفضاء',
          'مخطط هولوغرافي لمحطة استكشاف',
          'نبرة حوار صوتية درامية ملحمية',
        ]
      : [
          'Anamorphic Lens Flare Overlay 4K',
          'Atmospheric Deep Bass Rumble',
          'Kepler Bio-Dome Holographic Map',
          'Elena Vance Voice Cue (Urgent)',
        ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    await db.createAsset({
      projectId: activeProjectId || 'proj_kepler_01',
      userId: 'usr_moro_director',
      name: randomName,
      type: 'image',
      mimeType: 'image/png',
      fileSize: 3200000,
      storageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
      tags: ['Uploaded', 'Asset', '4K'],
      metadata: { source: 'User Upload', resolution: '3840x2160' },
    });

    await loadAssets();
    showNotification(isRtl ? `تم تسجيل الأصل "${randomName}" في المكتبة` : `Asset "${randomName}" registered in library`, 'success');
  };

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-sky-400" />;
      case 'video':
        return <Film className="w-4 h-4 text-amber-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-purple-400" />;
      case 'voice':
        return <Mic className="w-4 h-4 text-emerald-400" />;
      case 'script':
      case 'document':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'character':
        return <Users className="w-4 h-4 text-indigo-400" />;
      default:
        return <FolderArchive className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">{t.assets.title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.assets.subtitle}
          </p>
        </div>

        <button
          onClick={handleSimulatedUpload}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{t.assets.btnUpload}</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 text-slate-500`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'البحث بالاسم أو الوسوم...' : 'Search by asset name or tags...'}
            className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-[#0c0f15] border border-slate-800 rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400`}
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#0c0f15] border border-slate-800 rounded-lg overflow-x-auto text-xs">
          {[
            { id: 'all', label: t.assets.filterAll },
            { id: 'image', label: t.assets.filterImages },
            { id: 'video', label: t.assets.filterVideos },
            { id: 'voice', label: t.assets.filterVoices },
            { id: 'audio', label: t.assets.filterAudio },
            { id: 'script', label: t.assets.filterScripts },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === tab.id
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <EmptyState
          icon={FolderArchive}
          title={t.assets.noAssetsTitle}
          description={t.assets.noAssetsDesc}
          actionLabel={t.assets.btnUpload}
          onAction={handleSimulatedUpload}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`group rounded-lg border border-slate-800 bg-[#0d1017] hover:border-slate-700 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                {asset.thumbnailUrl || asset.storageUrl.startsWith('http') ? (
                  <img
                    src={asset.thumbnailUrl || asset.storageUrl}
                    alt={asset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600 space-y-1">
                    {getAssetIcon(asset.type)}
                    <span className="text-[10px] uppercase font-mono">{asset.type}</span>
                  </div>
                )}

                <div className={`absolute top-2 ${isRtl ? 'right-2' : 'left-2'} p-1 rounded bg-black/60 backdrop-blur-sm`}>
                  {getAssetIcon(asset.type)}
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-200 truncate" title={asset.name}>
                  {asset.name}
                </div>

                {/* Metadata row */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="capitalize">{asset.type}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {(asset.fileSize / (1024 * 1024)).toFixed(1)} MB
                  </span>
                  {asset.durationSeconds && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{asset.durationSeconds}s</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {asset.tags.join(' · ')}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAsset(asset.id);
                    }}
                    title={t.common.delete}
                    className="text-slate-600 hover:text-rose-400 p-1 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-lg rounded-xl bg-[#0e121a] border border-slate-800 p-6 space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {getAssetIcon(selectedAsset.type)}
                <h3 className="text-sm font-bold text-white truncate max-w-xs">
                  {selectedAsset.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                {t.common.close}
              </button>
            </div>

            {selectedAsset.storageUrl.startsWith('http') && (
              <div className="aspect-video bg-black rounded overflow-hidden">
                <img
                  src={selectedAsset.storageUrl}
                  alt={selectedAsset.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-3 rounded border border-slate-800">
                <div>
                  <span className="text-slate-500">MIME:</span> {selectedAsset.mimeType}
                </div>
                <div>
                  <span className="text-slate-500">{isRtl ? 'الحجم:' : 'Size:'}</span> {(selectedAsset.fileSize / (1024 * 1024)).toFixed(2)} MB
                </div>
                <div>
                  <span className="text-slate-500">{isRtl ? 'تاريخ الإنشاء:' : 'Created:'}</span> {new Date(selectedAsset.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-slate-500">{isRtl ? 'النوع:' : 'Type:'}</span> {selectedAsset.type}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block mb-1">{isRtl ? 'الوسوم:' : 'Tags:'}</span>
                <span className="text-slate-300 text-xs font-mono">{selectedAsset.tags.join(' · ')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
