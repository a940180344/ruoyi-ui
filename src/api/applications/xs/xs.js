import request from '@/utils/request'

// 查询协商列表
export function listXs(query) {
  return request({
    url: '/xs/xs/list',
    method: 'get',
    params: query
  })
}

// 查询协商详细
export function getXs(xsId) {
  return request({
    url: '/xs/xs/' + xsId,
    method: 'get'
  })
}

// 新增协商
export function addXs(data) {
  return request({
    url: '/xs/xs',
    method: 'post',
    data: data
  })
}

// 修改协商
export function updateXs(data) {
  return request({
    url: '/xs/xs',
    method: 'put',
    data: data
  })
}

// 删除协商
export function delXs(xsId) {
  return request({
    url: '/xs/xs/' + xsId,
    method: 'delete'
  })
}
