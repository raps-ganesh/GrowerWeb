import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  constructor() {}

  GetYears()
  {
    var yearsArray: number[]=[];
    let cropyear1 :number = environment.cropyear != undefined ? environment.cropyear : 2022;
    for (let index = cropyear1; index > cropyear1-5; index--) {
        yearsArray.push(index);
    }

    return yearsArray;
  }

  
  paging(
    pagecount: number,
    pagenumber: number,
    totalrecords: number,
    pagesize: number
  ): any {
    debugger;
    pagecount=Math.ceil(totalrecords/pagesize);
    var pagingArray: number[];
    var end =
      pagecount < parseInt(pagesize.toString()) ? 1
        : pagenumber < 7 ? 1
        : pagenumber + 7 < pagecount ? pagenumber + 7
        : pagecount;
    var startFrom =
      pagecount < parseInt(pagesize.toString())
        ? 1
        : pagenumber < 7
        ? 1
        : pagenumber - 7 <= 0
        ? 1
        : pagenumber - 7;
    var size = pagecount > parseInt(pagesize.toString()) ? parseInt(pagesize.toString()) : pagecount;
   
    if(pagecount-(startFrom-1) <pagesize)
    {
      size = pagecount-(startFrom-1);
    }

    pagingArray =
      totalrecords == 0
        ? Array(0)
        : Array(size)
            .fill(end)
            .map((_x, i) => i + startFrom);
    return pagingArray;
  }

  pagingMessage(
    totalrecords: number,
    pagenumber: number,
    datacount: number,
    pagesize : number=10
  ): string {
    var from =
      totalrecords == 0 ? 0 : pagenumber == 1 ? 1 : (pagenumber - 1) * pagesize + 1;
    var to =
      totalrecords == 0
        ? 0
        : pagenumber == 1
        ? totalrecords <= pagesize
          ? totalrecords
          : pagesize
        : (pagenumber - 1) * pagesize + datacount;
    return 'Showing ' + from + ' to ' + to + ' of ' + totalrecords + ' entries';
  }
}
