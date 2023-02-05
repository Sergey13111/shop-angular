import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);

    if (this.data) this.isNew = false;
  }

  myForm: FormGroup = new FormGroup({
    id: new FormControl(this.data?.id ?? null),
    title: new FormControl(this.data?.title ?? '', [
      Validators.required,
      Validators.minLength(3),
    ]),
    price: new FormControl(this.data?.price ?? '', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
    ]),
    year: new FormControl(this.data?.year ?? '', [
      Validators.required,
      Validators.minLength(4),
    ]),
    chip: new FormControl(this.data?.configure.chip ?? '', Validators.required),
    ssd: new FormControl(this.data?.configure.ssd ?? '', Validators.required),
    memory: new FormControl(
      this.data?.configure.memory ?? '',
      Validators.required
    ),
    display: new FormControl(
      this.data?.configure.display ?? '',
      Validators.required
    ),
  });

  isNew: boolean = true;

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onSubmit() {
    console.log(this.myForm);
    this.data = {
      id: this.myForm.value.id,
      title: this.myForm.value.title,
      price: this.myForm.value.price,
      year: this.myForm.value.year,
      image: 'assets/images/macbook.jpeg',
      configure: {
        chip: this.myForm.value.chip,
        ssd: this.myForm.value.ssd,
        memory: this.myForm.value.memory,
        display: this.myForm.value.display,
      },
    };

    this.dialogRef.close(this.data);
  }
}
