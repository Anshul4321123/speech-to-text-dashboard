import { NhostClient } from '@nhost/nhost-js'

// Pick up from environment variables with fallbacks for local development
const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN 
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION 

export const nhost = new NhostClient({
  subdomain: NHOST_SUBDOMAIN,
  region: NHOST_REGION
})