import { Directive, ElementRef, NgZone } from '@angular/core';
import ImageCompressor from 'image-compressor.js';
import { FileSelectDirective } from 'ng2-file-upload';

declare var imageCompressor: any
const compressor = new ImageCompressor()

@Directive({
  selector: '[appImgCompressor]'
})
export class ImgCompressorDirective extends FileSelectDirective {

  constructor(private zone: NgZone, private elementRef: ElementRef) {
    super(elementRef)
  }

  onChange(): any {
    //Retrieve the selected files
    const files: FileList = this.element.nativeElement.files 

    this.zone.runOutsideAngular(() => {
      const promises: Promise<Blob>[] = []

      //Compress each file and preserve a quality of 50%
      for(let i = 0; i < files.length; i++){
        const file = files[i]
        promises.push(compressor.compress(file, {quality: .5}))
      }
    })
  }

}
