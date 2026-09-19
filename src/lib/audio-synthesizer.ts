/**
 * HARUKA MIRAI · STORYLINE SOUNDTRACK AUDIO ENGINE
 *
 * Plays the official soundtrack from `/photos/story_sound.mp3` when the
 * Storyline welcome shutter is lifted, looping continuously while the user
 * explores the story acts.
 */

class SuccessionThemeEngine {
  private audioEl: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (!this.audioEl) {
      this.audioEl = new Audio("/photos/story_sound.mp3");
      this.audioEl.loop = true;
      this.audioEl.volume = 0.7;
      this.audioEl.preload = "auto";
    }
    return this.audioEl;
  }

  /**
   * Start playing the theme music
   */
  public play() {
    const audio = this.initAudio();
    if (!audio) return;
    this.isPlaying = true;
    audio.muted = this.isMuted;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy waiting for active user interaction
      });
    }
  }

  /**
   * Stop playing the theme music
   */
  public stop() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
  }

  /**
   * Toggle Play/Pause
   */
  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  /**
   * Mute / Unmute audio output
   */
  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.audioEl) {
      this.audioEl.muted = muted;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const successionEngine = new SuccessionThemeEngine();
