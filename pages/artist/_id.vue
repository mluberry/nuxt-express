<script>
  import axios from 'axios';

  export default {
    name: 'Artist',
    data ({ params, error, env, isClient, isDev }) {
      return axios.get(`${env.url}/api/artist/${params.id}`, {
        params: {
          offset: 0,
          limit: 10
        }
      })
      .then((res) => {
        const { artist, albums } = res.data;
        if (isClient) {
          console.info('Artist:', artist);
          console.info('Albums:', albums);
        }
        return {
          artist: artist,
          albums: albums.items,
          limit: albums.limit,
          offset: albums.offset,
          total: albums.total
        };
      })
      .catch((e) => {
        if (isClient && isDev) {
          console.error(e);
        }
        error({ statusCode: 404, message: 'Artist not found' });
      });
    },
    head () {
      return {
        title: this.artist.name
      };
    }
  }
</script>

<template>
  <div class="container">
    <ol class="breadcrumb">
      <li><router-link to="/">Recherche</router-link></li>
      <li class="active">{{ artist.name }}</li>
    </ol>
    <div class="page-header">
      <h1>Albums</h1>
      <h2>{{ artist.name }}</h2>
    </div>
    <div class="container albums">
      <div class="row">
        <div v-for="album in albums" class="col-xs-12 col-sm-4 col-md-4 col-lg-3">
          <div class="thumbnail text-center">
            <router-link v-bind:to="'/album/' + album.id">
              <img v-bind:src="album.images[1].url" class="img-responsive" alt="{album.name}" />
            </router-link>
            <div class="caption">
              <h4>{{ album.name }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
