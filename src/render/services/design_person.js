import { db_person } from './db';
import lodash from 'lodash';

const design_person_search_doc = {
  _id: '_design/search',
  views: {
    count_by_text: {
      map: ((doc) => {
        let prefix_keys = [''];
        if (doc.member_year !== undefined){
          Object.keys(doc.member_year).forEach((v) => {
            prefix_keys.push(v + '_');
          })
        }
        let firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        prefix_keys.forEach((prefix) => {
          emit(prefix + firstname + surname);
          emit(prefix + surname + firstname);
        });
        const ks = ['member_id', 'nickname', 'address', 'email', 'email_work', 'phone_mobile', 'phone_home', 'phone_work'];
        ks.forEach((k) => {
          if (doc[k] === undefined){
            return;
          }
          let str = doc[k].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
          prefix_keys.forEach((prefix) => {
            emit(prefix + str);
          })
        });
      }).toString(),
      reduce: '_count'
    },
    count_by_member_year: {
      map: ((doc) => {
        if (typeof doc.member_year === 'object'){
          Object.keys(doc.member_year).forEach((yk) => {
            emit(yk.substring(1));
          });
        }
      }).toString(),
      reduce: '_count'
    },
    count_by_name: {
      map: ((doc) => {
        let firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        emit(firstname + surname);
      }).toString(),
      reduce: '_count'
    },
    count_by_date_of_birth: {
      map: ((doc) => {
        if (doc.date_of_birth === undefined){
          return;
        }
        let date_of_birth = doc.date_of_birth.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (date_of_birth === ''){
          return;
        }
        emit(date_of_birth);
      }).toString(),
      reduce: '_count'
    },
    count_by_phone_mobile: {
      map: ((doc) => {
        if (doc.phone_mobile === undefined){
          return;
        }
        let phone_mobile = doc.phone_mobile.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (phone_mobile === ''){
          return;
        }
        emit(phone_mobile);
      }).toString(),
      reduce: '_count'
    },
    count_by_phone_home: {
      map: ((doc) => {
        if (doc.phone_home === undefined){
          return;
        }
        let phone_home = doc.phone_home.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (phone_home === ''){
          return;
        }
        emit(phone_home);
      }).toString(),
      reduce: '_count'
    },
    count_by_phone_work: {
      map: ((doc) => {
        if (doc.phone_work === undefined){
          return;
        }
        let phone_work = doc.phone_work.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (phone_work === ''){
          return;
        }
        emit(phone_work);
      }).toString(),
      reduce: '_count'
    },
    count_by_email: {
      map: ((doc) => {
        if (doc.email === undefined){
          return;
        }
        let email = doc.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (email === ''){
          return;
        }
        emit(email);
      }).toString(),
      reduce: '_count'
    },
    count_by_email_work: {
      map: ((doc) => {
        if (doc.email_work === undefined){
          return;
        }
        let email_work = doc.email_work.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (email_work === ''){
          return;
        }
        emit(email_work);
      }).toString(),
      reduce: '_count'
    },
    count_by_address: {
      map: ((doc) => {
        if (doc.address === undefined){
          return;
        }
        let address = doc.address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (address === ''){
          return;
        }
        emit(address);
      }).toString(),
      reduce: '_count'
    },
    count_by_group: {
      map: ((doc) => {
        if (!doc.group){
          return;
        }
        if (doc.group === undefined){
          return;
        }
        let group_ary = doc.group.split(',');
        group_ary.forEach((g) => {
          let group = g.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
          if (group === ''){
            return;
          }
          emit(group);
        });
      }).toString(),
      reduce: '_count'
    }
  }
};

const put_design_person_search = () => {
  const put_design = db_person.get(design_person_search_doc._id).catch((err) => {
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

  put_design.then(() => {
    console.log('db_person build indexes ==');

    console.log('build indexes db_person search/count_by_text');

    return db_person.query('search/count_by_text', {
      limit: 0
    });

  }).then((res) => {

    console.log('build indexes db_person search/count_by_member_year');

    return db_person.query('search/count_by_member_year', {
      limit: 0
    });
  }).then((res) => {

    console.log('build indexes db_person search/count_by_name');

    return db_person.query('search/count_by_name', {
      limit: 0
    });
  }).then((res) => {

    console.log('build indexes db_person search/count_by_date_of_birth');

    return db_person.query('search/count_by_date_of_birth', {
      limit: 0
    });
  }).then((res) => {

    console.log('build indexes db_person search/count_by_phone_mobile');

    return db_person.query('search/count_by_phone_mobile', {
      limit: 0
    });
  }).then((res) => {

    console.log('build indexes db_person search/count_by_phone_home');

    return db_person.query('search/count_by_phone_home', {
      limit: 0
    });
  }).then((res) => {

    console.log('build indexes db_person search/count_by_phone_work');

    return db_person.query('search/count_by_phone_work', {
      limit: 0
    });

  }).then((res) => {

    console.log('build indexes db_person search/count_by_email');

    return db_person.query('search/count_by_email', {
      limit: 0
    });

  }).then((res) => {

    console.log('build indexes db_person search/count_by_email_work');

    return db_person.query('search/count_by_email_work', {
      limit: 0
    });

  }).then((res) => {

    console.log('build indexes db_person search/count_by_address');

    return db_person.query('search/count_by_address', {
      limit: 0
    });

  }).then((res) => {

    console.log('build indexes db_person search/count_by_group');

    return db_person.query('search/count_by_group', {
      limit: 0
    });

  }).catch((err) => {
    console.log(err);
  });
};

export { put_design_person_search };
