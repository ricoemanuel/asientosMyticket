import { Injectable, Query } from '@angular/core';
import { collection, Firestore, addDoc, getDocs, collectionData, getDoc, doc, query, where, setDoc, DocumentData, QuerySnapshot, onSnapshot } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {


  constructor(private firestore: Firestore) { }

  addEvento(evento:any) {
    const entradaRef = collection(this.firestore, "eventos")
    return addDoc(entradaRef, evento)
  }
  getAsiento(fila: number, columna: number): Promise<QuerySnapshot<DocumentData>> {
    const entradaRef = collection(this.firestore, 'asientos');
    const q = query(entradaRef, where('fila', '==', fila), where('columna', '==', columna));
    return getDocs(q);
  }
  getAsientoRealtime(fila: number, columna: number, evento:string): Observable<DocumentData[]> {
    const entradaRef = collection(this.firestore, 'asientos');
    const q= query(entradaRef, where('fila', '==', fila), where('columna', '==', columna),where('evento', '==', evento));
  
    return new Observable<DocumentData[]>(observer => {
      const unsubscribe = onSnapshot(q, snapshot => {
        const asientos: DocumentData[] = [];
        snapshot.forEach(doc => {
          asientos.push(doc.data());
        });
        observer.next(asientos);
      });
  
      // Unsubscribe function
      return () => {
        unsubscribe();
      };
    });
  }
  actualizarAsiento(asiento:any){
    const entradaRef=doc(this.firestore,"asientos",`${asiento.fila}${asiento.columna}${asiento.evento}`)
    setDoc(entradaRef,asiento)
  }
  setAsiento(asiento:any){
    const entradaRef=doc(this.firestore,"asientos",`${asiento.fila}${asiento.columna}${asiento.evento}`)
    setDoc(entradaRef,asiento)
  }
  
  getEventos() {
    const entradaRef = collection(this.firestore, "eventos");
  
    return collectionData(entradaRef, { idField: 'id' }).pipe(
      map(eventos => eventos.map(evento => ({ id: evento['id'], ...evento })))
    );
  }
  async getEvento(eventoId: string): Promise<DocumentData | undefined> {
    const eventoRef = doc(this.firestore, 'eventos', eventoId);
    const eventoSnapshot = await getDoc(eventoRef);
    
    if (eventoSnapshot.exists()) {
      return eventoSnapshot.data();
    }
    
    return undefined;
  }
  // 

  // }
  // editEntrada(entrada:any,id:string){
  //   const entradaRef=doc(this.firestore,"entradas",id)
  //   setDoc(entradaRef,entrada)
  // }
  // getUsuarios(id:any){
  //   const usuarioRef=doc(this.firestore,"usuarios",id)
  //   return getDoc(usuarioRef)
  // }
  // getEntradasFalse(){
  //   const entradaRef=collection(this.firestore,`entradas`)
  //   return getDocs(query(entradaRef,where("estado","==",false)))
  // }
  // getGeneral(){
  //   const entradaRef=collection(this.firestore,`entradas`)
  //   return getDocs(query(entradaRef,where("zona","==","general"),where("estado","==",false)))
  // }
  // getVip(){
  //   const entradaRef=collection(this.firestore,`entradas`)
  //   return getDocs(query(entradaRef,where("zona","==","vip"),where("estado","==",false)))
  // }
  // getMeet(){
  //   const entradaRef=collection(this.firestore,`entradas`)
  //   return getDocs(query(entradaRef,where("zona","==","meet"),where("estado","==",false)))
  // }
  // getEntradasTrueVip(){
  //   const entradaRef=collection(this.firestore,`entradas`)
  //   return getDocs(query(entradaRef,where("zona","==","vip"),where("estado","==",true)))
  // }
  // getEntradasTrueGeneral(){
  //   const entradaRef=collection(this.firestore,`entradas`)
  //   return getDocs(query(entradaRef,where("zona","==","general"),where("estado","==",true)))
  // }
  // getentradaByCedula(cedula:string){
  //   const entradaRef=collection(this.firestore,`entradas`)
  //   return getDocs(query(entradaRef,where("cedula","==",cedula)))
  // }
}
