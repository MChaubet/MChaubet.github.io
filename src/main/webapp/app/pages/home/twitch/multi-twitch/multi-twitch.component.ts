import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-multi-twitch',
  templateUrl: './multi-twitch.component.html',
  styleUrls: ['./multi-twitch.component.scss'],
})
export class MultiTwitchComponent implements OnInit {
  streams: { channel: string; volume: number }[] = [
    { channel: 'zevent', volume: 1 },
    { channel: 'zerator', volume: 1 },
  ];

  done!: { channel: string; volume: number }[];

  experimentalSound: boolean = false;
  focusedIndex: number | null = null;

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const streamsParam = params.get('streams');

    if (streamsParam) {
      this.streams = streamsParam.split(';').map(channel => ({
        channel: channel.trim(),
        volume: 1,
      }));
    } else {
      // fallback par défaut si aucun paramètre
      this.streams = [
        { channel: 'zevent', volume: 1 },
        { channel: 'zerator', volume: 1 },
      ];
    }
  }

  onAddStream(): void {
    if (this.streams.length >= 9) return alert('Limite de 9 streams atteinte.');
    const c = prompt('Chaîne Twitch ?');
    if (c) this.streams.push({ channel: c.toLowerCase(), volume: 0 });
  }

  onRemoveStream(idx: number): void {
    this.streams.splice(idx, 1);
    if (this.focusedIndex === idx) this.focusedIndex = null;
  }

  onFocusStream(idx: number): void {
    this.focusedIndex = this.focusedIndex === idx ? null : idx;
    if (this.focusedIndex !== null) {
      // baisse les autres
      this.streams.forEach((s, i) => {
        if (i !== idx) s.volume = 2;
      });
    }
  }
  onFocusSound(idx: number): void {
    this.streams.filter((_, i) => i !== idx).forEach(s => (s.volume = 0));
  }

  onVolumeChange(idx: number, newVolume: number): void {
    this.streams[idx].volume = newVolume;

    if (!this.experimentalSound) return;
    if (this.focusedIndex === null) {
      const others = this.streams.filter((_, i) => i !== idx);
      const remaining = 100 - newVolume;
      const share = others.length > 0 ? Math.floor(remaining / others.length) : 0;

      others.forEach((s, i) => {
        let newVal = share;
        if (i === others.length - 1) {
          newVal = remaining - share * (others.length - 1);
        }
        s.volume = newVal;
      });
    }
  }
}
