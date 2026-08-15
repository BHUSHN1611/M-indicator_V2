export interface Station {
  code: string;
  name: string;
  lat: number;
  lng: number;
  sequenceIndex: number;  // 0 = Virar, 8 = Dahanu Road
}

export const VIRAR_DAHANU_STATIONS: Station[] = [
  { code: 'VR',  name: 'Virar',       lat: 19.4553059, lng: 72.811816,  sequenceIndex: 0 },
  { code: 'VTN', name: 'Vaitarna',    lat: 19.5186517, lng: 72.8499772, sequenceIndex: 1 },
  { code: 'SPL', name: 'Saphale',     lat: 19.5771316, lng: 72.8218812, sequenceIndex: 2 },
  { code: 'KVR', name: 'Kelve Road',  lat: 19.6240526, lng: 72.7911751, sequenceIndex: 3 },
  { code: 'PLG', name: 'Palghar',     lat: 19.6978882, lng: 72.7718888, sequenceIndex: 4 },
  { code: 'UM',  name: 'Umroli',      lat: 19.7557614, lng: 72.7604506, sequenceIndex: 5 },
  { code: 'BSR', name: 'Boisar',      lat: 19.7984865, lng: 72.761452,  sequenceIndex: 6 },
  { code: 'VGN', name: 'Vangaon',     lat: 19.8829908, lng: 72.7631658, sequenceIndex: 7 },
  { code: 'DRD', name: 'Dahanu Road', lat: 19.9915236, lng: 72.7434083, sequenceIndex: 8 },
];
