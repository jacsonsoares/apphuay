// importando pacotes necessarios para contexto e funcoes
import React, {createContext, useCallback, useState, useContext, useEffect } from 'react';

// package para gravar dados local
import AssyncStorage from '@react-native-community/async-storage';

// importando dados para conexao com API
import api from '../services/api';

// interface de login
interface signInCredentials{
  email : string;
  password : string;
}

// interface para criar o contexto e o metodo de autenticacao
interface AuthContextData{
  user : object;
  signIn(credentials : signInCredentials) : Promise<void>;
  signOut() : void;
}

// interface para armazenar dados apos autenticacao
interface AuthState {
  token : string;
  user : object;
}

// criando contexto de autenficacao
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// exportando metodo de contexto e autenticacao
export const AuthProvider : React.FC = ({ children}) => {
  // validando o estado das informacoes do usuario
  // apos algum refresh ou ateracao de rota
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStorageData() : Promise<void>{
      const [token, user] = await AssyncStorage.multiGet(['@focus:token', '@focus:user']);
      if (token && user ){
        setData({ 
          token : token[1] !== null ? token[1] : '', 
          user : JSON.parse(user[1] !== null ? user[1] : '') 
        });
      }
      
    }
    loadStorageData();
  },[]);

  // metodo de validacao de login
  const signIn = useCallback(async({ email, password }) => {
    // Criando usuario 
    const lUser = {
      user: email,
      password: password
    };
    
    // autenticando na API
    const lResult = await api.post('/login', lUser);
    console.log('chegou no Auth..');
    console.log(lResult.data);
    if (lResult.data){
      if (lResult.data.status === 'OK'){
        // armazenando resultado da autenticacao
        const {token, user} = lResult.data;
        await AssyncStorage.multiSet([
          ['@focus:token', token], 
          ['@focus:user', JSON.stringify(user)] 
        ]);
        // armazenando estado apos altenticacao contexto
        setData({token , user}); 
      }
    }

    

  }, [] );

  // metodo de logout
  const signOut = useCallback(async () => {
    //limpando storage
    await AssyncStorage.multiRemove(['@focus:user', '@focus:token']) ;
    setData({} as AuthState);
  }, []);


  return (
    //retornando contexto com as informacoes de autenticacao envolvendo o conteudo da rota
    <AuthContext.Provider value = {{user : data.user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() : AuthContextData{
  const context = useContext(AuthContext);
  if (!context){
    throw new Error('useAuth deve ser usado com AuthProvider!');
  }
  return context;
}
