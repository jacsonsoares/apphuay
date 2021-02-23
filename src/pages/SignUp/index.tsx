import React,{ useCallback, useRef }  from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';

import { Container, Title, BackButton, BackButtonText } from './styles';

const SignUp : React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);  
  const passwordRef = useRef<TextInput>(null);
  
  const navigation = useNavigation();

  interface SignUpFormData{
    name: string;
    email: string;
    phone : string;
    password: string;
  }

  const handledSignUp = useCallback(async (data : SignUpFormData) => {
    try {
      console.log(data);
     
      // limpando os erros
      formRef.current?.setErrors({});
      // validando formulario
      const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
      
      const lSchema = Yup.object().shape({
        name : Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Informe um e-mail válido.'),
        phone: Yup.string().required('Cellular obrigatório').matches(phoneRegExp, 'Celular Inválido').min(10, "minimo 10").max(12, "maximo 12"),
        password: Yup.string().required('Senha obrigatória'),
      });
      await lSchema.validate(data, { abortEarly: false });
      
      // Criando usuario 
      const lUser = {
        issuer_id: 1,
        user_name: data.name,
        user_login: data.email,
        password: data.password,
        phone : data.phone
      };
      const lResult = await api.post('/collaborator', lUser);
      //console.log('Resultado : ' + JSON.stringify(lResult.data));      
      if (lResult.data){
        if (lResult.data.status === 'OK'){
          Alert.alert('Conta cadastrada com sucesso!', 'Aguarde contato ou email de liberação para acessar o aplicativo.');
          //retirecionado
          navigation.goBack();
        }else{
          Alert.alert(lResult.data.status, lResult.data.message);
        }
      }

    } catch (err) {
      // validando excessoes do formulario
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        // exibindo excessoes no formulario
        formRef.current?.setErrors(errors);
        //para nao processar o addToast, continua somente quando houver erro.
        return;
      }
      Alert.alert('Erro na Autenticação','Erro ao fazer login, valide as credenciais');      
    }
  }, []);
  
    
  //KeyboardAvoidingView : utilizada para que o teclado no IOs nao sobreponha o container
  return (
    <>
      <KeyboardAvoidingView 
        style={{flex : 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined }      
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex : 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <Title>Crie sua conta</Title>
              <Form ref={formRef} onSubmit={handledSignUp} >
              <Input 
                name="name" icon="user" placeholder="Nome"
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() =>{
                  emailRef.current?.focus();
                }}
              /> 
              <Input 
                ref={emailRef}
                name="email" icon="mail" placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>{
                  phoneRef.current?.focus();
                }}
              /> 
              <Input 
                ref={phoneRef}
                name="phone" icon="phone" placeholder="DD + Celular"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() =>{
                  passwordRef.current?.focus();
                }}
              /> 
              <Input 
                ref={passwordRef}
                name="password" icon="lock"  placeholder="Senha"
                secureTextEntry  
                returnKeyType="send"
                textContentType="newPassword"
                onSubmitEditing={() =>{
                  formRef.current?.submitForm();
                }}
              />
              <Button onPress={() =>{
                formRef.current?.submitForm();
              }}>
                Criar
              </Button>
            </Form>
            
            
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>   
      <BackButton onPress={() => navigation.navigate('SignIn')}>
        <Icon name="arrow-left" size={20} color="#FFF" />
        <BackButtonText>Voltar para Logon</BackButtonText>
      </BackButton>
    </>
  );
}

export default SignUp;

