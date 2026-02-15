import io.specmatic.stub.ContractStub
import io.specmatic.enterprise.SpecmaticContractTest
import org.junit.jupiter.api.BeforeAll

class YourTest: SpecmaticContractTest
  companion object {
    private val mock: ContractStub
    @BeforeAll
    @JvmStatic
    fun setUp() {
        mock = createStub()
    }
  }
}
