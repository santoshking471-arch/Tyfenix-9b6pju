import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/hooks/useTheme';

function CartTabIcon({ color, size }: { color: string; size: number }) {
  const { count } = useCart();
  return (
    <View>
      <MaterialIcons name="shopping-cart" size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 60, android: 70, default: 70 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 8, android: 10, default: 8 }),
    paddingHorizontal: 4,
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="category" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <CartTabIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="receipt-long" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
