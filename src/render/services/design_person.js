import { db_person } from './db';
import lodash from 'lodash';

const design_person_search_doc = {
  _id: '_design/search',
  views: {
    count_by_text: {
      map: ((doc) => {
        const prefix_keys = [''];
        if (doc.member_year !== undefined){
          Object.keys(doc.member_year).forEach((v) => {
            prefix_keys.push(v + '.');
          });
        }
        const firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        const surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        prefix_keys.forEach((prefix) => {
          emit(prefix + firstname + surname);
          emit(prefix + surname + firstname);
        });
        const ks = ['member_id', 'nickname', 'address', 'email', 'email_work', 'phone_mobile', 'phone_home', 'phone_work'];
        ks.forEach((k) => {
          if (doc[k] === undefined){
            return;
          }
          if (doc[k] === ''){
            return;
          }
          const str = doc[k].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
          prefix_keys.forEach((prefix) => {
            emit(prefix + str);
          });
        });
      }).toString(),
      reduce: '_count'
    },

    count_by_simular: {
      map: ((doc) => {
        const firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        const surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        emit('name.' + firstname + surname);

        const key_prefixes = ['date_of_birth', 'phone_mobile', 'phone_work', 'phone_home',
          'email', 'email_work', 'address'];
        key_prefixes.forEach((k) => {
          if (doc[k] === undefined){
            return;
          }
          if (doc[k] === ''){
            return;
          }
          const str = doc[k].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
          emit(k + '.' + str);
        });

        if (doc.group === undefined){
          return;
        }
        if (doc.group === ''){
          return;
        }
        const group_ary = doc.group.split(',');
        group_ary.forEach((g) => {
          const group = g.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
          if (group === ''){
            return;
          }
          emit('group.' + group);
        });
      }).toString(),
      reduce: '_count'
    },
  }
};

const put_design_person_search = () => {
  db_person.get(design_person_search_doc._id).catch((err) => {
    if (err.name === 'not_found'){
      return 'put';
    }
    throw err;
  }).then((res) => {
    if (res === 'put'){
      return design_person_search_doc;
    }
    let compare_design_doc = {...res};
    delete compare_design_doc._rev;
    if (lodash.isEqual(compare_design_doc, design_person_search_doc)){
      throw 'no change for design_person_search_doc';
    }
    design_person_search_doc._rev = res._rev;
    return design_person_search_doc;
  }).then((res) => {
    return db_person.put(res);
  }).then((res) => {
    console.log('design_person_search_doc updated');
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
};

export { put_design_person_search };
