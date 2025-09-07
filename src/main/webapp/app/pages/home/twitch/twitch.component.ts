import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

declare var Twitch: any;

interface StreamData {
  channel: string;
  volume: number;
  player?: any;
  slider?: HTMLInputElement;
  element?: HTMLElement;
}

@Component({
  selector: 'jhi-twitch',
  templateUrl: './twitch.component.html',
  styleUrls: ['./twitch.component.scss'],
})
export class TwitchComponent implements OnInit {
  @ViewChild('streamsContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  streams: StreamData[] = [];
  focusedIndex: number | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // streams par défaut
    ['joueur_du_grenier', 'mynthos', 'domingo', 'mistermv', 'rivenzi'].forEach(c => this.addStream(c, 0));
  }

  addStream(channel: string, vol = 0): void {
    const div = this.renderer.createElement('div');
    this.renderer.addClass(div, 'stream');

    div.innerHTML = `
      <button class="remove-btn">❌</button>
      <div class="player"></div>
      <div class="controls">
        <label>Vol:</label>
        <input type="range" min="0" max="100" value="${vol}" class="slider">
        <span>${vol}%</span>
        <button class="focus-btn">🎧 Focus</button>
      </div>
    `;

    this.renderer.appendChild(this.containerRef.nativeElement, div);

    // Twitch player
    const pid = 'player-' + Math.random().toString(36).slice(2, 8);
    div.querySelector('.player')!.id = pid;
    const parentHost = window.location.hostname || 'localhost';

    // @ts-ignore
    const p = new Twitch.Player(pid, { channel, width: '100%', height: '100%', parent: [parentHost] });
    // @ts-ignore
    p.addEventListener(Twitch.Player.READY, () => p.setVolume(vol / 100));

    // slider
    const slider = div.querySelector('.slider') as HTMLInputElement;
    slider.addEventListener('input', () => this.updateVolumes(slider));

    // bouton focus
    const fbtn = div.querySelector('.focus-btn') as HTMLButtonElement;
    fbtn.addEventListener('click', () => {
      const idx = this.streams.findIndex(s => s.element === div);
      if (this.focusedIndex === idx) {
        this.focusedIndex = null;
        fbtn.classList.remove('active');
      } else {
        this.focusedIndex = idx;
        this.containerRef.nativeElement.querySelectorAll('.focus-btn').forEach((b: any) => b.classList.remove('active'));
        fbtn.classList.add('active');

        // baisse les autres volumes
        this.streams.forEach((s, i) => {
          if (i !== idx && s.slider) {
            s.slider.value = '2';
            (s.slider.nextElementSibling as HTMLElement).textContent = '2%';
            s.player.setVolume(0.02);
          }
        });
      }
      this.applyLayout();
    });

    // bouton remove
    div.querySelector('.remove-btn')!.addEventListener('click', () => {
      const idx = this.streams.findIndex(s => s.element === div);
      this.streams.splice(idx, 1);
      if (this.focusedIndex === idx) this.focusedIndex = null;
      div.remove();
      this.applyLayout();
    });

    this.streams.push({ channel, volume: vol, player: p, slider, element: div });
    this.applyLayout();
  }

  updateVolumes(currentSlider: HTMLInputElement): void {
    const value = parseInt(currentSlider.value);
    (currentSlider.nextElementSibling as HTMLElement).textContent = value + '%';

    const idx = this.streams.findIndex(s => s.slider === currentSlider);
    if (idx >= 0) this.streams[idx].player.setVolume(value / 100);

    if (this.focusedIndex === null) {
      const others = this.streams.filter(s => s.slider !== currentSlider);
      const remaining = 100 - value;
      const share = others.length > 0 ? Math.floor(remaining / others.length) : 0;

      others.forEach((s, i) => {
        let newVal = share;
        if (i === others.length - 1) {
          newVal = remaining - share * (others.length - 1);
        }
        if (s.slider) {
          s.slider.value = String(newVal);
          (s.slider.nextElementSibling as HTMLElement).textContent = newVal + '%';
          s.player.setVolume(newVal / 100);
        }
      });
    }
  }

  applyLayout(): void {
    const container = this.containerRef.nativeElement;
    if (this.focusedIndex === null) {
      container.classList.remove('focus-mode');
      this.streams.forEach(s => {
        s.element?.classList.remove('focused', 'mini');
      });
    } else {
      container.classList.add('focus-mode');
      this.streams.forEach((s, i) => {
        if (i === this.focusedIndex) {
          s.element?.classList.add('focused');
          s.element?.classList.remove('mini');
        } else {
          s.element?.classList.add('mini');
          s.element?.classList.remove('focused');
        }
      });
    }
  }

  onAddStreamClick(): void {
    const c = prompt('Chaîne Twitch ?');
    if (c) this.addStream(c.toLowerCase(), 0);
  }
}
