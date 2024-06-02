import { ServiceService } from './service.service';
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private service: ServiceService) {}
  selectedText: any;

  selectedFile: any;
  fileContent: any;

  labels: string[] = [];
  selectedLabels: string[] = [];

  addLabel(newLabel: string) {
    if (newLabel && !this.labels.includes(newLabel)) {
      this.labels.push(newLabel);
    }
  }
  selectLabel(label: string) {
    if (!this.selectedLabels.includes(label)) {
      this.selectedLabels.push(label);
    }
  }

  deselectLabel(label: string) {
    this.selectedLabels = this.selectedLabels.filter(
      (l) => l.trim() !== label.trim()
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileContent = null;

    if (this.selectedFile) {
      this.readFileContent();
    }
  }

  readFileContent() {
    const reader = new FileReader();
    reader.readAsText(this.selectedFile);
    reader.onload = () => {
      this.fileContent = reader.result as string;
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  }

  @HostListener('document:selectionchange', ['$event'])
  onTextSelect(event: MouseEvent): void {
    const selectedText = window.getSelection()?.toString();
    if (selectedText == '') this.selectedText = '';
    else this.selectedText = selectedText;
  }

  annotate() {
    this.service.annotate(this.selectedText, this.selectedLabels).subscribe(
      (response) => {
        this.service.exportAsJSON(response, 'response.json');
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
