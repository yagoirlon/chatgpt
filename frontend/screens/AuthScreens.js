import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>StepReward Login</Text>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <Pressable onPress={() => login(email, password)} style={{ backgroundColor: '#4f46e5', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
      </Pressable>
    </View>
  );
}

export function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Create account</Text>
      <TextInput placeholder='Name' value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <TextInput placeholder='Referral Code (optional)' value={referralCode} onChangeText={setReferralCode} style={{ borderWidth: 1, padding: 12, borderRadius: 10 }} />
      <Pressable onPress={() => register({ name, email, password, referralCode })} style={{ backgroundColor: '#4f46e5', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Register</Text>
      </Pressable>
    </View>
  );
}
