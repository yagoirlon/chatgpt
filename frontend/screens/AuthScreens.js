import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>StepReward</Text>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <Pressable onPress={() => login(email, password)} style={{ backgroundColor: '#4f46e5', padding: 14, borderRadius: 10 }}><Text style={{ color: 'white', textAlign: 'center' }}>Login</Text></Pressable>
      <Pressable onPress={onSwitch}><Text style={{ color: '#4f46e5', textAlign: 'center' }}>Create account</Text></Pressable>
    </View>
  );
}

export function RegisterScreen({ onSwitch }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=12');

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Create account</Text>
      <TextInput placeholder='Name' value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Avatar URL' value={avatar} onChangeText={setAvatar} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Referral Code (optional)' value={referralCode} onChangeText={setReferralCode} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <Pressable onPress={() => register({ name, email, password, referralCode, avatar })} style={{ backgroundColor: '#4f46e5', padding: 14, borderRadius: 10 }}><Text style={{ color: 'white', textAlign: 'center' }}>Register</Text></Pressable>
      <Pressable onPress={onSwitch}><Text style={{ color: '#4f46e5', textAlign: 'center' }}>Already have an account</Text></Pressable>
    </View>
  );
}
