export interface DocumentModel {

    id:number;
    title: string;
    description: string;
    pdfFileName?:string;
    pdfUrl?:string;
    documentTypeId:number;
    thumbnailUrl ?:string;
    thumbnailName ?:string;
    isActive?:boolean
}
