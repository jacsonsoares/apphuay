import React,{ useCallback, useRef }  from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation } from '@react-navigation/native';
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

  const handledSignUp = useCallback((data : object) => {
    console.log(data);
  },[]);

  
    
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

