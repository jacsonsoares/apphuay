import styled, {css} from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ContainerProps{
  isFocused: boolean;
  isErroed : boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background : #232129;
  border-radius : 10px;
  margin-bottom : 8px;
  border-width : 1px;
  border-color : #232129;

  flex-direction : row;
  align-items : center;
  ${(props) => 
    props.isFocused && 
    css`
      border-color : #F4EDE8;
    `
  }
  ${(props) => 
    props.isErroed && 
    css`
      border-color : #d4051f;
    `  
  }
`;
export const TextInput = styled.TextInput`
  flex : 1;
  color : #FFF;
  font-size : 16px;
  font-family : 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-left : 16px;
`;