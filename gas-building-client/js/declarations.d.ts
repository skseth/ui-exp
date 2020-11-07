import { InventoryService } from '@shared/building-model'
import { GoogleScriptRun } from '@shared/gas-client-lib'

declare global {
  namespace google {
    namespace script {
      let run: GoogleScriptRun<InventoryService>
    }
  }
}
