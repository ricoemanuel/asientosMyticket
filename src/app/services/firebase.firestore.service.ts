import { Injectable, Query } from '@angular/core';
import { collection, Firestore, addDoc, getDocs, collectionData, getDoc, doc, query, where, setDoc, DocumentData, QuerySnapshot, onSnapshot } from '@angular/fire/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {


  constructor(private firestore: Firestore) { }

  addEvento(evento: any) {
    const entradaRef = collection(this.firestore, "eventos")
    return addDoc(entradaRef, evento)
  }
  getAsiento(fila: number, columna: number, evento: string) {
    const entradaRef = collection(this.firestore, 'asientos');
    const q = query(entradaRef, where('fila', '==', fila), where('columna', '==', columna), where('evento', '==', evento));
    return getDocs(q);
  }
  getAsientoRealtime(fila: number, columna: number, evento: string): Observable<DocumentData[]> {
    const entradaRef = collection(this.firestore, 'asientos');
    const q = query(entradaRef, where('fila', '==', fila), where('columna', '==', columna), where('evento', '==', evento));

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
  actualizarAsiento(asiento: any) {
    const entradaRef = doc(this.firestore, "asientos", `f${asiento.fila}c${asiento.columna}-${asiento.evento}`)
    setDoc(entradaRef, asiento)
  }
  setAsiento(asiento: any) {
    const entradaRef = doc(this.firestore, "asientos", `f${asiento.fila}c${asiento.columna}-${asiento.evento}`)
    return setDoc(entradaRef, asiento)
  }
  deleteAsiento(asiento: any) {
    const entradaRef = doc(this.firestore, "asientos", `f${asiento.fila}c${asiento.columna}-${asiento.evento}`)
    return deleteDoc(entradaRef);
  }
  setEvento(eventoId: string,evento:any) {
    const entradaRef = doc(this.firestore,"eventos", eventoId)
    return setDoc(entradaRef, evento)
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
  getAsientosNull() {
    const entradaRef = collection(this.firestore, 'asientos');
    const q = query(entradaRef, where('vendedor', '==', 'null'), where('estado', '==', 'ocupado'));
    return getDocs(q);
  }
  getAsientosPorEvento(evento: string) {
    const entradaRef = collection(this.firestore, 'asientos');
    const q = query(entradaRef, where('evento', '==', evento));
    return getDocs(q);
  }
  setVendedor(vendedor:any){
    const entradaRef = collection(this.firestore,"vendedores")
    return addDoc(entradaRef, vendedor)
  }
  getVendedores(eventoId: string) {
    const entradaRef = collection(this.firestore, 'vendedores');
    const q = query(entradaRef, where('evento', '==', eventoId));
    return getDocs(q);
  }
}
