import { InventoryService } from '../../shared/building-model/index'
import { GoogleScriptRun } from '../../shared/gas-client-lib/index'

declare namespace google {
  namespace script {
    let run: GoogleScriptRun<InventoryService>
  }
}
