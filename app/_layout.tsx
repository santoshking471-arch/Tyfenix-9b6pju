import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
                  <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="checkout" options={{ headerShown: false }} />
                  <Stack.Screen name="order-success" options={{ headerShown: false }} />
                  <Stack.Screen name="admin/index" options={{ headerShown: false }} />
                  <Stack.Screen name="admin/products" options={{ headerShown: false }} />
                  <Stack.Screen name="admin/orders" options={{ headerShown: false }} />
                  <Stack.Screen name="admin/users" options={{ headerShown: false }} />
                  <Stack.Screen name="admin/categories" options={{ headerShown: false }} />
                  <Stack.Screen name="admin/banners" options={{ headerShown: false }} />
                  <Stack.Screen name="products/listing" options={{ headerShown: false }} />
                  <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
                  <Stack.Screen name="profile/addresses" options={{ headerShown: false }} />
                </Stack>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
