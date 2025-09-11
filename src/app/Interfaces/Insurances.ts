export interface Seguro {
    imagen: string;
    coberturas: string[];
  }

  
export interface AuthData {
  email: string;
  password: string;
  rememberMe?: boolean;
  repitPassword?: string;
  confirmationCode?: string;
  newPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  isSignedIn?: boolean;
  nextStep?: any;
  challengeUser?: any;
  message?: string;
  error?: string;
  sub?:string;
}

export interface PersonalData {
  name: string;
  apellido: string;
  edad: number;
  sexo: string;
  medications?: string[];     
  familyIllnesses?: string[];  
  illnesses?: string[];       
}

export interface MedicalTestInfo {
  id: string;
  titulo: string;
  descripcion:string;
  precio: string;
}