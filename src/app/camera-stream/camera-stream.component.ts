import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { Camera } from '../camera';

@Component({
  selector: 'app-camera-stream',
  templateUrl: './camera-stream.component.html',
  styleUrls: ['./camera-stream.component.css']
})
export class CameraStreamComponent implements OnInit {

  camera: Camera;

  constructor() { }

  ngOnInit() {
    this.camera = {
      url: 'http://localhost:5000/0815-0000/getImage',
      fps: 20
    };
    timer(0, 1000 / this.camera.fps).subscribe(_ => {
      this.camera.url = 'http://localhost:5000/0815-0000/getImage?time=' + new Date().getTime();
    });
  }

}
