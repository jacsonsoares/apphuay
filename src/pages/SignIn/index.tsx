import React, { useCallback, useRef } from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import {useAuth} from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles';

interface SignInFormData{
  email: string;
  password: string;
}

const SignIn : React.FC = () => {
  //para fazer o submit
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInput>(null);

  const navigation = useNavigation();
  const { signIn } = useAuth();

  // metodo que valida e chama autenticao do usuario
  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      console.log(data);
     
      // limpando os erros
      formRef.current?.setErrors({});
      // validando formulario
      const lSchema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email('Informe um e-mail válido.'),
        password: Yup.string().required('Senha obrigatória'),
      });
      await lSchema.validate(data, { abortEarly: false });
      
      // Autenticando usuario
      //await signIn({email : data.email, password : data.password});

      //retirecionado
      //history.push('/dashboard');

    } catch (err) {
      // validando excessoes do formulario
      if (err instanceof Yup.ValidationError) {
        console.log('chegou no erro...');
        const errors = getValidationErrors(err);
        console.log(errors);
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
            <Title>Faça seu Logon</Title>
            <Form ref={formRef} onSubmit={handleSignIn} >
              <Input
                name="email" icon="mail" placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>{
                  passwordRef.current?.focus();
                }}
              /> 
              <Input 
                ref={passwordRef}
                name="password" 
                icon="lock"  
                placeholder="Senha"
                secureTextEntry  
                returnKeyType="send"
                onSubmitEditing={() =>{
                  formRef.current?.submitForm();
                }}
              />
              <Button onPress={() =>{
                formRef.current?.submitForm();
              }}>
                Entrar
              </Button>
              <ForgotPassword onPress={() =>{console.log('esqueci...')}}>
                <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
              </ForgotPassword>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>   
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')} >
        <Icon name="log-in" size={20} color="#f4ede8" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
}

export default SignIn;