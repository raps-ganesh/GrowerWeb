import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-report-type-ahead',
  templateUrl: './report-type-ahead.component.html',
  styleUrls: ['./report-type-ahead.component.scss']
})
export class ReportTypeAheadComponent {
  searchText: any;
  dataList: any;
  @Input() inputClass: any;
  @Input() urlToSearch: any;
  @Input() maxResultCount: number = 10;
  @Input() placeholder: any;
  @Input() inputid: any;
  @Input() inputValue: any;
  selectedValue: any;
  @Output() onSelect = new EventEmitter<string>();
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.inputValue != undefined)
      if (this.inputValue != '') {

        if ((
          document.getElementById(this.inputid) as HTMLInputElement
        ) != undefined) {
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.remove('ng-invalid');
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.add('ng-valid');
        }
      } else {
        if ((
          document.getElementById(this.inputid) as HTMLInputElement
        ) != undefined) {
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.remove('ng-valid');
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.add('ng-invalid');
        }
      }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputValue != undefined)
      if (this.inputValue != '') {

        if ((
          document.getElementById(this.inputid) as HTMLInputElement
        ) != undefined) {
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.remove('ng-invalid');
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.add('ng-valid');
        }
      } else {
        if ((
          document.getElementById(this.inputid) as HTMLInputElement
        ) != undefined) {
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.remove('ng-valid');
          (
            document.getElementById(this.inputid) as HTMLInputElement
          ).classList.add('ng-invalid');
        }
      }
  }
  search(event: any) {
    if (this.searchText != '') {
      (document.getElementById('dataList') as HTMLInputElement).style.display =
        'block';
      this.searchData().subscribe({
        next: (data: any) => {
          this.dataList = data.filter((val: any, i: number) => i < this.maxResultCount);
        },
      });
    } else this.dataList = null;
  }

  setValue(data: any) {

    this.searchText = data.value;
    this.selectedValue = data.key;
    this.dataList = null;
    setTimeout(() => {
      this.callSelection();
    }, 200);
  }

  searchData(): Observable<any> {
    return this.http.get<any>(this.urlToSearch + '/' + this.searchText).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  callSelection() {
    this.onSelect.next(this.selectedValue);
    setTimeout(() => {
      if ((document.getElementById('dataList') as HTMLInputElement) != null)
        (
          document.getElementById('dataList') as HTMLInputElement
        ).style.display = 'none';
    }, 500);
  }
}
