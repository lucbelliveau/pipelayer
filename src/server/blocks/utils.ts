import {
  type ProviderResource,
  type Input,
  type Resource,
  type ResourceOptions,
} from "@pulumi/pulumi";

export const dependsOn = (
  dependsOn: Input<Input<Resource>[]>,
  options?: ResourceOptions
): ResourceOptions =>
  Object.assign({}, options, {
    dependsOn,
  });

export const provider = (
  provider: ProviderResource,
  options?: ResourceOptions
): ResourceOptions => Object.assign({}, options, { provider });

export const deletedWith = (
  deletedWith: Input<Input<Resource>>,
  options?: ResourceOptions
): ResourceOptions =>
  Object.assign({}, options, {
    deletedWith,
  });