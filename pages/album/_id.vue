<script>
  import axios from 'axios';
  import _ from 'lodash';
  import moment from 'moment';

  export default {
    name: 'Album',
    data ({ params, error, env, isClient, isDev }) {
      return axios.get(`${env.url}/api/album/${params.id}`)
      .then((res) => {
        const album = res.data;
        if (isClient) {
          console.info('Album:', album);
          console.info('Artist:', album.artists[0]);
        }
        return {
          album: album,
          artist: album.artists[0],
          audioObject: null
        };
      })
      .catch((e) => {
        if (isClient && isDev) {
          console.error(e);
        }
        error({ statusCode: 404, message: 'Album not found' });
      });
    },
    head () {
      return {
        title: this.album.name
      };
    },
    methods: {
      getImage () {
        return _.get(this.album, 'images.0.url', 'http://placehold.it/640x640');
      },
      asDuration (track) {
        const min = moment.duration(track.duration_ms).get('minutes');
        const sec = moment.duration(track.duration_ms).get('seconds');
        return _.padStart(min, 2, '0') + ':' + _.padStart(sec, 2, '0');
      },
      listen (event) {
        const trackEl = $(event.target).parent('.track');
        const playIconEl = $(trackEl.children('.play-icon')[0]);
        if (trackEl !== null) {
          if (trackEl.hasClass('playing')) {
            this.audioObject.pause();
            playIconEl.hide();
          } else {
            if (this.audioObject) {
              this.audioObject.pause();
              playIconEl.hide();
            }

            this.audioObject = new Audio(trackEl.data('url'));
            this.audioObject.play();
            trackEl.addClass('playing');
            playIconEl.show();

            this.audioObject.addEventListener('ended', () => {
              trackEl.removeClass('playing');
              playIconEl.hide();
            });
            this.audioObject.addEventListener('pause', () => {
              trackEl.removeClass('playing');
              playIconEl.hide();
            });
          }
        }
      }
    }
  }
</script>

<template>
  <div class="container">
    <div v-if="artist && album">
      <ol class="breadcrumb">
        <li><router-link to="/">Recherche</router-link></li>
        <li><router-link v-bind:to="'/artist/' + artist.id">{{ artist.name }}</router-link></li>
        <li class="active">{{ album.name }}</li>
      </ol>
      <div class="page-header">
        <h1>Pistes</h1>
        <h2>{{ artist.name }} - {{ album.name }}</h2>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-6 col-lg-6">
          <img v-bind:src="getImage()" class="thumbnail img-responsive" alt="{album.name}" />
        </div>
        <div class="col-xs-12 col-md-6 col-lg-6">
          <ul class="list-group">
            <li v-for="track in album.tracks.items" v-bind:data-url="track.preview_url" class="track list-group-item">
              {{ track.track_number }}. <a @click.prevent="listen">{{ track.name }}</a>
              &nbsp;<span class="glyphicon glyphicon-play play-icon" style="display:none;" aria-hidden="true"></span>
              <span class="badge">{{ asDuration(track) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .track {
    a {
      cursor: pointer;
    }
    &.playing {
      font-weight: bold;
    }
  }
</style>
