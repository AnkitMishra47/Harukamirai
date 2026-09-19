/**
 * HARUKA MIRAI · STORYLINE SOUNDTRACK
 *
 * Plays `/photos/story_sound.mp3` when the Storyline welcome shutter is lifted,
 * looping while the visitor explores the acts.
 *
 * One `Audio` element, `loop = true`, and nothing else. No Web Audio graph, no
 * gain automation, no seam handling - the browser plays the file and takes it
 * back round on its own.
 *
 * That is deliberate and it is a reversal. A previous pass drove the loop by
 * hand, taking the track back round at 37.0s through a gain dip to skip the
 * outro fade. It worked on paper and ticked in the ear: the dip was stepped
 * through `setValueAtTime` once per animation frame, and a gain that moves in
 * ~60 discrete steps is a series of tiny discontinuities in the waveform, which
 * is what a click is. Smoothing it properly would mean a `linearRampToValueAtTime`
 * envelope, and at that point a player for one background track has grown an
 * audio engine to solve a problem nobody asked it to solve.
 *
 * The cost of plain playback, stated so nobody rediscovers it as a bug: the file
 * ends with its own two-second outro fade, so each loop has a short dip to
 * silence before the track restarts at full level. That is the file's shape, not
 * a defect in this code, and the honest fix is to trim the tail off the mp3
 * rather than to process around it here.
 */

const BASE_VOLUME = 0.7;

class SuccessionThemeEngine {
  private audioEl: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (!this.audioEl) {
      this.audioEl = new Audio("/photos/story_sound.mp3");
      this.audioEl.loop = true;
      this.audioEl.volume = BASE_VOLUME;
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
