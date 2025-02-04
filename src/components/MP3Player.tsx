import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

const MP3Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [equalizer, setEqualizer] = useState<number[]>(Array(8).fill(50));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setEqualizer(prev => 
          prev.map(() => Math.random() * 100)
        );
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="w-full max-w-3xl bg-darkPurple p-6 rounded-lg shadow-2xl">
      <div className="flex gap-6">
        {/* Left section with time and equalizer */}
        <div className="bg-black p-4 rounded-md w-48">
          <div className="text-neonGreen font-mono text-3xl mb-4 animate-glow">
            {formatTime(currentTime)}
          </div>
          <div className="flex items-end h-20 gap-1">
            {equalizer.map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-neonGreen animate-equalizerBar"
                style={{
                  height: `${isPlaying ? height : 0}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right section with controls */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="text-neonGreen font-mono mb-4">
            DAY 1: YOU'RE AT {formatTime(currentTime)} SINCE THE START WHERE CHAINLIGHT IS LEADING...
          </div>

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlay}
              className="bg-black p-2 rounded-full hover:bg-gray-900 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-neonGreen" />
              ) : (
                <Play className="w-6 h-6 text-neonGreen" />
              )}
            </button>
            <div className="flex-1">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-neonGreen" />
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        src="/song.mp3"
      />
    </div>
  );
};

export default MP3Player;