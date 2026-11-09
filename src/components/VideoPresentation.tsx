import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize,
  Video,
  RotateCcw,
  RotateCw,
  ExternalLink,
  AlertCircle,
  EyeOff,
  Settings,
  Sliders,
  CheckCircle2,
  Trash2,
  Upload,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { parseUniversalVideoUrl, generateShareableVideoUrl } from '../utils/videoUtils';

interface VideoPresentationProps {
  onOpenOwnerDashboard?: () => void;
  onOpenOwnerLogin?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const VideoPresentation: React.FC<VideoPresentationProps> = ({
  onOpenOwnerDashboard,
  onOpenOwnerLogin
}) => {
  const { videoPresentation, isOwnerLoggedIn, updateVideoPresentation } = useAgency();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useNativeControls, setUseNativeControls] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBuffering, setIsBuffering] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoInfo = parseUniversalVideoUrl(videoPresentation.videoUrl);

  const handleShare = () => {
    const shareUrl = generateShareableVideoUrl(videoPresentation.videoUrl);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {});
    }
  };

  // Reset error when URL changes
  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
    setIsPlaying(false);
    setCurrentTime(0);
  }, [videoPresentation.videoUrl]);

  // Sync fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch((err) => {
            console.warn('Playback interrupted or prevented by browser:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    setVolume(newVol);
    videoRef.current.volume = newVol;
    if (newVol === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(0, videoRef.current.currentTime + seconds),
      duration || 999999
    );
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const cyclePlaybackRate = () => {
    if (!videoRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const handleFullScreen = async () => {
    const container = playerContainerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
      if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen();
      }
    }
  };

  // If section is toggled hidden
  if (videoPresentation && videoPresentation.visible === false) {
    if (isOwnerLoggedIn) {
      return (
        <section id="presentation-video" className="py-6 bg-amber-50/60 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
              <div className="flex items-center gap-3">
                <EyeOff className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-900">
                    Section Vidéo actuellement masquée aux visiteurs
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Les visiteurs ne voient pas cette section. Vous pouvez la réactiver à tout moment.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateVideoPresentation({ visible: true })}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  Rendre visible
                </button>
                {onOpenOwnerDashboard && (
                  <button
                    onClick={onOpenOwnerDashboard}
                    className="px-3.5 py-1.5 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Espace Propriétaire
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  // If no video URL is configured (deleted)
  if (videoInfo.platform === 'empty') {
    if (isOwnerLoggedIn) {
      return (
        <section id="presentation-video" className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="p-8 bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-xs">
              <div className="w-14 h-14 bg-blue-50 text-[#073587] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                Aucune vidéo de présentation configurée
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
                Vous avez supprimé la vidéo ou elle n'est pas encore définie. Vous pouvez téléverser un fichier MP4 ou coller un lien YouTube / Google Drive depuis votre espace propriétaire.
              </p>
              {onOpenOwnerDashboard && (
                <button
                  onClick={onOpenOwnerDashboard}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#073587] hover:bg-[#05235c] text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Ajouter une vidéo dans l'Espace Propriétaire</span>
                </button>
              )}
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section id="presentation-video" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#073587] bg-blue-50 px-3 py-1.5 rounded-md mb-2 border border-blue-100">
            <Video className="w-3.5 h-3.5 text-amber-500" />
            <span>Vidéo de Présentation Officielle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {videoPresentation.title || "Présentation Officielle d'Africa Web"}
          </h2>
          {videoPresentation.subtitle && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              {videoPresentation.subtitle}
            </p>
          )}

          {/* Quick Owner Management Toolbar if logged in */}
          {isOwnerLoggedIn && onOpenOwnerDashboard && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={onOpenOwnerDashboard}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#073587] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-colors cursor-pointer"
                title="Remplacer ou supprimer cette vidéo dans votre espace propriétaire"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Espace Propriétaire : Remplacer ou Supprimer</span>
              </button>
            </div>
          )}
        </div>

        {/* Video Player Frame with full Android and Desktop compatibility */}
        <div
          ref={playerContainerRef}
          className="max-w-4xl mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group select-none"
        >
          {/* Top Browser / Stream Bar */}
          <div className="bg-slate-950/90 px-3.5 sm:px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block shrink-0" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block shrink-0" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shrink-0" />
              <span className="ml-2 font-mono text-[11px] text-slate-300 truncate">
                {videoInfo.label}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Quick Share Link button */}
              <button
                onClick={handleShare}
                className="text-[10px] sm:text-[11px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded transition-colors inline-flex items-center gap-1 cursor-pointer font-bold"
                title="Copier le lien public direct de cette vidéo pour WhatsApp et les réseaux sociaux"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Lien copié !</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3 text-amber-400" />
                    <span>Partager</span>
                  </>
                )}
              </button>

              {videoPresentation.duration && (
                <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-bold">
                  {videoPresentation.duration}
                </span>
              )}

              {!videoInfo.isIframe && (
                <button
                  onClick={() => setUseNativeControls(prev => !prev)}
                  className="text-[10px] text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-2 py-0.5 rounded transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
                  title="Basculer entre les commandes intégrées et les commandes système de votre navigateur"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{useNativeControls ? 'Commandes personnalisées' : 'Commandes natives'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Player Display Area */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {/* 1. UNIVERSAL IFRAME EMBED (YouTube, Google Drive, Vimeo, Dailymotion) */}
            {videoInfo.isIframe && videoInfo.embedUrl && (
              <iframe
                src={videoInfo.embedUrl}
                title={videoPresentation.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            )}

            {/* 2. HTML5 DIRECT VIDEO (MP4, WebM, Local File, Dropbox, Blob) */}
            {!videoInfo.isIframe && videoInfo.streamUrl && (
              <>
                <video
                  ref={videoRef}
                  src={videoInfo.streamUrl}
                  className="w-full h-full object-contain cursor-pointer"
                  playsInline
                  // @ts-ignore
                  webkit-playsinline="true"
                  // @ts-ignore
                  x5-playsinline="true"
                  controls={useNativeControls}
                  controlsList="nodownload"
                  preload="metadata"
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setDuration(videoRef.current.duration);
                    }
                  }}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => {
                    setIsBuffering(false);
                    setIsPlaying(true);
                    setHasError(false);
                  }}
                  onEnded={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error('HTML5 Video Error:', e);
                    // If current video URL fails (e.g. broken external link or device-specific blob),
                    // instantly fall back to the bundled local presentation video
                    if (
                      videoInfo.streamUrl &&
                      videoInfo.streamUrl !== '/assets/aistudio/AfricaWeb_22ef340a.mp4' &&
                      videoInfo.streamUrl !== '/videos/africaweb-presentation.mp4'
                    ) {
                      console.warn('Switching to bundled video /assets/aistudio/AfricaWeb_22ef340a.mp4');
                      updateVideoPresentation({ videoUrl: '/assets/aistudio/AfricaWeb_22ef340a.mp4' });
                      setHasError(false);
                      return;
                    }
                    setHasError(true);
                    setErrorMessage(
                      "Impossible de lire cette vidéo directement. Le format est peut-être incompatible ou le lien est expiré."
                    );
                  }}
                  onClick={!useNativeControls ? togglePlay : undefined}
                />

                {/* Big Center Play Button Overlay on Pause */}
                {!isPlaying && !useNativeControls && !hasError && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center cursor-pointer transition-opacity backdrop-blur-[1px]"
                    aria-label="Lancer la vidéo"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 active:scale-95 transition-all">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-1" />
                    </div>
                    <span className="mt-3 text-xs sm:text-sm font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full shadow-md">
                      Appuyez pour lancer la vidéo
                    </span>
                  </div>
                )}

                {/* Buffering Spinner */}
                {isBuffering && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Error Banner with Direct Fallback Action */}
                {hasError && (
                  <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center z-20">
                    <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
                    <h4 className="text-white text-base font-black mb-1">
                      Problème de lecture vidéo
                    </h4>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-md mb-4">
                      {errorMessage}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setHasError(false);
                          if (videoRef.current) {
                            videoRef.current.load();
                            videoRef.current.play().catch(() => {});
                          }
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Réessayer
                      </button>
                      {videoInfo.streamUrl && (
                        <a
                          href={videoInfo.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ouvrir le fichier direct</span>
                        </a>
                      )}
                      {isOwnerLoggedIn && onOpenOwnerDashboard && (
                        <button
                          onClick={onOpenOwnerDashboard}
                          className="px-4 py-2 bg-[#073587] hover:bg-[#05235c] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Remplacer la vidéo
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Custom Android & Desktop Controls Bar */}
                {!useNativeControls && !hasError && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2 text-white transition-opacity duration-200">
                    {/* Interactive Timeline Progress Bar */}
                    <div className="w-full flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-mono text-slate-300 w-10 text-right">
                        {formatTime(currentTime)}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-grow h-1.5 sm:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                        aria-label="Progression de la vidéo"
                      />
                      <span className="text-[10px] sm:text-xs font-mono text-slate-300 w-10">
                        {formatTime(duration)}
                      </span>
                    </div>

                    {/* Bottom Row Controls */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Play/Pause */}
                        <button
                          onClick={togglePlay}
                          className="p-1.5 sm:p-2 bg-white/15 hover:bg-white/25 active:scale-95 rounded-lg text-white transition-all cursor-pointer"
                          aria-label={isPlaying ? 'Pause' : 'Lecture'}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                          ) : (
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
                          )}
                        </button>

                        {/* Rewind 10s */}
                        <button
                          onClick={() => skipTime(-10)}
                          className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-white transition-all cursor-pointer"
                          title="Reculer de 10 secondes"
                          aria-label="Reculer de 10 secondes"
                        >
                          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        {/* Forward 10s */}
                        <button
                          onClick={() => skipTime(10)}
                          className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-white transition-all cursor-pointer"
                          title="Avancer de 10 secondes"
                          aria-label="Avancer de 10 secondes"
                        >
                          <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        {/* Mute / Unmute */}
                        <button
                          onClick={toggleMute}
                          className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-white transition-all cursor-pointer"
                          aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                          ) : (
                            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>

                        {/* Volume slider (desktop) */}
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hidden md:inline-block"
                          aria-label="Volume"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Playback speed toggle */}
                        <button
                          onClick={cyclePlaybackRate}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-[10px] sm:text-xs font-mono font-bold text-slate-200 transition-colors cursor-pointer"
                          title="Vitesse de lecture"
                        >
                          {playbackRate}x
                        </button>

                        {/* Fullscreen */}
                        <button
                          onClick={handleFullScreen}
                          className="p-1.5 sm:p-2 bg-white/15 hover:bg-white/25 active:scale-95 rounded-lg text-white transition-all cursor-pointer"
                          aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                        >
                          {isFullscreen ? (
                            <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Feature Highlights beneath video */}
        <div className="mt-6 max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lecture fluide garantie sur smartphones <strong>Android</strong> et <strong>ordinateurs PC/Mac</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">Qualité HD 1080p · Son stéréophonique</span>
          </div>
        </div>
      </div>
    </section>
  );
};
