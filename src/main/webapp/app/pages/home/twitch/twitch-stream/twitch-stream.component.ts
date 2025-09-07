import { Component, ElementRef, EventEmitter, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, ViewChild } from '@angular/core';

declare var Twitch: any;

@Component({
  selector: 'jhi-twitch-stream',
  standalone: false,
  templateUrl: './twitch-stream.component.html',
  styleUrls: ['./twitch-stream.component.scss'],
})
export class TwitchStreamComponent implements OnInit, OnDestroy, OnChanges {
  @Input() channel: string = 'AntoineDaniel';
  @Input() volume: number = 0;
  @Input() focused: boolean = false;
  @Input() focusedScreen: number | null = null;

  @Output() volumeChange = new EventEmitter<number>();
  @Output() focusStream = new EventEmitter<void>();
  @Output() focusSound = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  @ViewChild('playerContainer', { static: true }) playerContainer!: ElementRef<HTMLDivElement>;

  private player: any;

  ngOnInit(): void {
    const pid = 'player-' + Math.random().toString(36).slice(2, 8);
    this.playerContainer.nativeElement.id = pid;
    const parentHost = window.location.hostname || 'mchaubet.github.io';

    if (!this.channel) {
      console.error('❌ Aucun channel fourni à TwitchStreamComponent');
      return;
    }

    this.player = new Twitch.Player(pid, {
      channel: this.channel,
      width: '100%',
      height: '100%',
      parent: [parentHost],
    });

    this.player.addEventListener(Twitch.Player.READY, () => {
      this.player.setVolume(this.volume / 100);
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.pause?.();
      this.player = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['volume'] && !changes['volume'].isFirstChange()) {
      // met à jour le slider et le player quand parent change la valeur
      this.player?.setVolume(this.volume / 100);
    }
    if (changes['focusedScreen'] && this.player) {
      if (this.focusedScreen === null || this.focused) {
        this.player.setQuality('auto');
      } else {
        const q = this.player.getQualities().find((q: any) => q.name === '360p');
        if (q) this.player.setQuality(q.group);
      }
    }
  }

  onVolumeChange(event: Event): void {
    const slider = event.target as HTMLInputElement;
    this.volume = parseInt(slider.value);
    this.volumeChange.emit(this.volume);
    this.player?.setVolume(this.volume / 100);
  }

  onFocusStreamClick(): void {
    this.focusStream.emit();
  }
  onFocusSoundClick(): void {
    this.focusSound.emit();
  }

  onRemoveClick(): void {
    this.remove.emit();
  }
}
