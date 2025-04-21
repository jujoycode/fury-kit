import axios from 'axios'
import type { PackageInfo } from '#interfaces/util.interface.js'

export class NpmUtil {
  private static readonly BASE_URL = 'https://registry.npmjs.org'

  static async getPackageVersion(packageNames: string | string[]) {
    if (typeof packageNames === 'string') {
      packageNames = [packageNames]
    }

    const pacakgeVersion = {} as Record<string, string>

    for (let i = 0; i < packageNames.length; i++) {
      const packageName = packageNames[i]
      const response = await axios.get<PackageInfo>(`${this.BASE_URL}/${packageName}`)

      pacakgeVersion[packageName] = response?.data?.['dist-tags']?.latest
    }

    return pacakgeVersion
  }
}
