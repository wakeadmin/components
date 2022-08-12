import { getCurrentInstance } from '@wakeadmin/demi';

export function useRouter() {
  const instance = getCurrentInstance();

  return instance?.proxy?.$router;
}

export function useRoute() {
  const instance = getCurrentInstance();

  return instance?.proxy?.$route;
}
