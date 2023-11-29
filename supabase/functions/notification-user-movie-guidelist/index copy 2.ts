// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { Novu } from "npm:@novu/node";

const _NovuApiKey_ = Deno.env.get('NOVU_API_KEY')!

const novu = new Novu(_NovuApiKey_);

Deno.serve(async (req) => {
  try {
    const { record } = await req.json()

    const novuApiResponse = await novu.trigger('movie_guidelisted', {
      to: {
          subscriberId: record.receiver_user_id
      },
      payload: {
          message: `@${record.sender_user_id.username} recomend u the movie ${record.film_id}!`
      }
    });
    return new Response(
      JSON.stringify({ novuResponse: novuApiResponse }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Failed to create Novu notification', error)
    return new Response('Server error.', {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })  }
})
