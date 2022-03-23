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
    const res = await result.json()
    return res.id
  }

  async function signature() {
    if (window.klaytn === undefined) {
      alert("There's no Kaikas. Please install Kaikas wallet.")
      return
    }
    const klaytn = window.klaytn
    const caver = window.caver
    const signMessage = 'Holder Verify'

    const wallet = await klaytn.enable()
    const account = wallet[0]
    try {
      const signing = await caver.klay.sign(signMessage, account)
      return signing
    } catch (err) {
      alert('Signature has been cancelled.')
      window.close()
    }
  }

  async function signVerify() {
    const serverURL = ''
    try {
      const userId = await discordInfo()
      const signingMessage = await signature()
      await axios.post(serverURL, {
        userId: userId,
        sigMsg: signingMessage,
      })
      alert('verify success')
      window.close()
    } catch (error) {
      alert('verify failed')
      window.close()
    }
  }
</script>
