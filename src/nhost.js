import { NhostClient } from '@nhost/nhost-js'

const NHOST_SUBDOMAIN = 'vjvvrpxrjokpvsqfhvrm'
const NHOST_REGION = 'ap-south-1'

export const nhost = new NhostClient({
  subdomain: NHOST_SUBDOMAIN,
  region: NHOST_REGION
})