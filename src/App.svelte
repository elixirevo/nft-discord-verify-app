<script lang="ts">
  import { onMount } from 'svelte'
  import axios from 'axios'

  onMount(async () => {
    await signVerify()
  })

  async function discordInfo() {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const tokenType = fragment.get('token_type')
    const accessToken = fragment.get('access_token')

    const result: any = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    })
    return result.id
  }

  async function signature() {
    const klaytn = window.klaytn
    const caver = window.caver
    const signMessage = 'Holder Verify'

    const wallet = await klaytn.enable()
    const account = wallet[0]
    try {
      const signing = await caver.klay.sign(signMessage, account)
      console.log('sign', signing)
      return signing
    } catch (err) {
      alert('Signature has been cancelled.')
    }
  }

  async function signVerify() {
    const caver = window.caver
    const serverURL = 'http://localhost:3000/verify'
    const signMessage = 'Holder Verify'

    const userId = await discordInfo()
    const signingMessage = await signature()
    const recovered = await caver.klay.accounts.recover(signMessage, signingMessage)
    console.log(recovered)
    const res: boolean = await axios.post(serverURL, {
      userId: userId,
      sigMsg: signMessage,
    })
    if (res === true) {
      console.log(res)
      alert('success')
    } else {
      alert('fail')
    }
  }
</script>
