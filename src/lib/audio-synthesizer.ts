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

const BASE_VOLUME = 0.28;

class SuccessionThemeEngine {
  private audioEl: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private fadeTimer: number | null = null;

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
    // A fade still in flight would otherwise hand the track back at whatever
    // level it had reached, or take it to silence a frame after it restarted.
    this.cancelFade();
    audio.volume = BASE_VOLUME;
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
    this.cancelFade();
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl.volume = BASE_VOLUME;
    }
  }

  /**
   * Fade to silence over `ms`, then stop.
   *
   * For the hand-over to the portfolio. `stop()` on its own pauses mid-bar while
   * the theatre is still animating out, so the music ended before the picture
   * did. This rides the element's own `volume` rather than building the Web
   * Audio graph the note at the top of this file argues against: the objection
   * there is to stepping a gain across a LOOP SEAM, where each step is a
   * discontinuity in a waveform that carries on playing. A ramp that ends in
   * silence has nothing after it to click against.
   */
  public fadeOut(ms: number) {
    const audio = this.audioEl;
    if (!audio || !this.isPlaying || ms <= 0) {
      this.stop();
      return;
    }
    this.cancelFade();
    const from = audio.volume;
    const start = performance.now();
    /*
     * An interval, not requestAnimationFrame. rAF does not run at all in a
     * background tab, so a story that reached its end while the visitor was
     * looking at something else would start a fade that never finished and the
     * track would carry on at full level until they came back. A timer is
     * throttled there rather than stopped, so the ramp is coarse but it always
     * arrives at silence and always calls stop().
     */
    this.fadeTimer = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms);
      audio.volume = from * (1 - t);
      if (t >= 1) this.stop();
    }, 25);
  }

  private cancelFade() {
    if (this.fadeTimer !== null) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
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
