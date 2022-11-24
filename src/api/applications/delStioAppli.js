import request from '@/utils/request'

// 查询delStio列表
export function listDel_stio(query) {
  return request({
    url: '/delStio/del_stio/list',
    method: 'get',
    params: query
  })
}

// 查询delStio详细
export function getDel_stio(id) {
  return request({
    url: '/delStio/del_stio/' + id,
    method: 'get'
  })
}

// 新增delStio
export function addDel_stio(data) {
  return request({
    url: '/delStio/del_stio/add',
    method: 'post',
    data: data
  })
}

// 修改delStio
export function updateDel_stio(data) {
  return request({
    url: '/delStio/del_stio',
    method: 'put',
    data: data
  })
}

// 删除delStio
export function delDel_stio(id) {
  return request({
    url: '/delStio/del_stio/' + id,
    method: 'delete'
  })
}
