import { Component, OnInit } from '@angular/core';
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  index = 0;

  constructor(private gallery: Gallery) { }

  ngOnInit(): void {
  }

  showGallery(index: number) {
    let prop = {
      images: [
        { path: './assets/db.png' },
      ],
      index
    };
    this.gallery.load(prop);
  }

}
