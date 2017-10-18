import { Injectable } from '@angular/core';
import Keen from 'keen-tracking';
import {environment} from '../environments/environment';

@Injectable()
export class KeenService {
  private client: Keen;

  constructor() {
    const { projectId, writeKey } = environment;
    
    this.client = new Keen({
      projectId,
      writeKey
    });

    if (!environment.production) {
      Keen.enabled = false;
      Keen.debug = true;
  
      this.client.on('recordEvent', (event, data) => {
        console.log('event:', event);
        console.log('data:', data);
      });
    }

    const timer = Keen.utils.timer();
    timer.start();
    
    // Batch-record events every 5s
    this.client.queueInterval(5);

    this.client.extendEvents(() => {
      return {
        geo: {
          info: { /* Enriched */ },
          ip_address: '${keen.ip}',
        },
        page: {
          info: { /* Enriched */ },
          title: document.title,
          url: document.location.href
        },
        referrer: {
          info: { /* Enriched */ },
          url: document.referrer
        },
        tech: {
          browser: Keen.helpers.getBrowserProfile(),
          info: { /* Enriched */ },
          user_agent: '${keen.user_agent}'
        },
        time: Keen.helpers.getDatetimeIndex(),
        visitor: {
          time_on_page: timer.value()
          /* Include additional visitor info here */
        },
        keen: {
          addons: [
            {
              name: 'keen:ip_to_geo',
              input: {
                ip: 'geo.ip_address'
              },
              output : 'geo.info'
            },
            {
              name: 'keen:ua_parser',
              input: {
                ua_string: 'tech.user_agent'
              },
              output: 'tech.info'
            },
            {
              name: 'keen:url_parser',
              input: {
                url: 'page.url'
              },
              output: 'page.info'
            },
            {
              name: 'keen:referrer_parser',
              input: {
                referrer_url: 'referrer.url',
                page_url: 'page.url'
              },
              output: 'referrer.info'
            }
          ]
        }
      };
    });

    this.client.recordEvent('pageviews', {
      title: document.title
    });    
  }
}
